import { APIClient, RegionUS, SendEmailRequest, TrackClient } from 'customerio-node';
import { error, debug } from './logger';
import { env } from '~/env.mjs';
import { prisma } from '~/server/prisma';

const cio = new TrackClient(
  env.CUSTOMERIO_TRACKING_SITE_ID,
  env.CUSTOMERIO_TRACKING_API_KEY,
  { region: RegionUS }
);

const emailClient = new APIClient(env.CUSTOMERIO_API_KEY);

export type EmailFromTemplate<T> = {
  to: string;
  templateId: string;
  data: T;
}

export interface CustomerIoUser {
  email: string;
  image?: any;
  createdAt?: Date | string;
}

export function toUnixSeconds(inDate: string | Date) {
  const date = typeof inDate === 'string' ? new Date(inDate) : inDate;

  return Math.floor(date.getTime() / 1000);
}

export const trackUser = async (id: string, event: string, data?: any) => {
  try {
    const { email } = await prisma.user.findUniqueOrThrow({
      where: { id },
      select: { email: true }
    })
    debug('trackUser :>> ', { email, event, data });
    return track(email, event, data);
  } catch (e) {
    error(`No user to track`, { id, event, data })
  }
}

// track(customerId: string | number, data?: RequestData): Promise<Record<string, any>>;
export const track = async (email: string, event: string, data?: any) => {
  if (email.indexOf('@') === -1) {
    // Because the users in customer.io come from a variety of services, we always need to call track
    // with the email address, because that's the only thing we can confidently rely on since the ID
    // in customer.io could have come from another source
    throw new Error('You must call track with an email address');
  }

  debug(`Customer.io tracking event [${event}] for ${email}`, data);

  return cio
    .track(email, {
      name: event,
      data,
    })
    .then(() => void 0)
    .catch((err) =>
      error(`Customer.io error sending tracking event: ${err.message}`, data)
    );
}

export const identify = async (user: CustomerIoUser) => {
  const { email, createdAt, ...rest } = user;
  const attributes: any = {
    ...rest,
  };

  if (!email) {
    return error(`Customer.io identify request failed - no email found`, user);
  }

  // Customer.io requires unix seconds: https://customer.io/docs/faq-timestamps/
  if (createdAt) attributes.created_at = toUnixSeconds(createdAt);

  debug(`Customer.io identify request for ${email}`, attributes);

  return cio
    .identify(email, attributes)
    .then(() => void 0)
    .catch((err) => {
      error(`Customer.io error identifying user: ${err.message}`, user);
    });
}

export async function sendEmailFromTemplate<T>({ to, templateId, data }: EmailFromTemplate<T>) {
  const request = new SendEmailRequest({
    to,
    transactional_message_id: templateId, // Template ID on customer.io
    message_data: data as Record<string, any>,
    identifiers: {
      email: to,
    },
    from: 'no-reply@scroobious.com',
  });

  debug(`Sending password reset email to ${to}`, data);

  return emailClient
    .sendEmail(request)
    .then((res) => {
      debug(res);
      return true;
    })
    .catch((err) => {
      error(err.statusCode, err.message);
      return false;
    });
}
