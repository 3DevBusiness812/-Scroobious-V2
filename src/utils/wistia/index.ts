import { z } from 'zod';
import { env } from '~/env.mjs';
import type { TWistiaSuccessPayload, TWistiaMediaStats, TWistiaMediaInfo } from "./types"

const WISTIA_UPLOAD_URL = 'https://upload.wistia.com';
const WISTIA_STATS_URL = (videoId: string) => `https://api.wistia.com/v1/stats/medias/${videoId}.json`

export const getVideoStats = z
  .function()
  .args(z.string()) // accepts an arbitrary number of arguments
  .implement(async (videoId) => {
    const url = WISTIA_STATS_URL(videoId);
    const res: TWistiaMediaStats = await fetch(url, {
      headers: {
        Authorization: `Bearer ${env.WISTIA_STATS_TOKEN}`,
      }
    }).then(r => r.json())

    return res;
  });

export const getMediaInfo = z
  .function()
  .args(z.string())
  .implement(async (mediaId) => {
    const url = `https://api.wistia.com/v1/medias/${mediaId}.json`;
    const res: TWistiaMediaInfo = await fetch(url, {
      headers: {
        Authorization: `Bearer ${env.WISTIA_ACCESS_TOKEN}`,
      }
    }).then(r => r.json())

    return res;
  });

export const getWistiaVideoUrl = z
  .function()
  .args(z.string())
  .implement(async (mediaId) => {
    const { assets } = await getMediaInfo(mediaId);
    const videoAsset = assets.filter((asset) => asset.contentType === 'video/mp4').sort((a, b) => a.fileSize - b.fileSize)[0];

    return videoAsset?.url;
  });
