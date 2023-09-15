import { CheckIcon } from "@heroicons/react/24/solid";
import type { Step } from ".";

type StepsNavProps = {
  steps: Step[];
  setActiveStep: (stepId: string) => void;
};

export default function StepsNav({ steps, setActiveStep }: StepsNavProps) {
  return (
    <nav aria-label="Progress">
      <ol
        role="list"
        className="divide-y divide-gray-300 rounded-y md:flex md:divide-y-0 border-b border-gray-300 bg-gray-50"
      >
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={`relative md:flex md:flex-1`}>
            {step.status === "complete" ? (
              <button
                onClick={() => setActiveStep(step.id)}
                className="group flex w-full items-center"
              >
                <span className="flex items-center px-6 py-3 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-orange-500 bg-white group-hover:bg-orange-500 text-orange-500 group-hover:text-white transition-all">
                    <CheckIcon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="ml-4 text-sm text-left font-medium text-gray-500 group-hover:text-gray-900">
                    {step.name}
                  </span>
                </span>
              </button>
            ) : step.status === "current" ? (
              <button
                onClick={() => setActiveStep(step.id)}
                className="flex items-center px-6 py-3 text-md font-medium"
                aria-current="step"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-orange-500 bg-orange-500 ">
                  <span className="text-white">{step.id}</span>
                </span>
                <span className="ml-4 text-sm text-left font-medium text-orange-600">
                  {step.name}
                </span>
              </button>
            ) : (
              <div className="group flex items-center cursor-default">
                <span className="flex items-center px-6 py-3 text-md font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 transition-all">
                    <span className="text-gray-500">{step.id}</span>
                  </span>
                  <span className="ml-4 text-sm text-left font-medium text-gray-500">
                    {step.name}
                  </span>
                </span>
              </div>
            )}

            {stepIdx !== steps.length - 1 && (
              <>
                <div
                  className="absolute right-0 top-0 hidden h-full w-5 md:block"
                  aria-hidden="true"
                >
                  <svg
                    className="h-full w-full text-gray-300"
                    viewBox="0 0 22 80"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 -2L20 40L0 82"
                      vectorEffect="non-scaling-stroke"
                      stroke="currentcolor"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
