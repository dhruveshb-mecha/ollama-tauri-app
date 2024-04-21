import React from "react";

export function UserIcon() {
  return (
    <div className="rounded-full bg-gray-100 border p-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        strokeWidth="0"
        viewBox="0 0 16 16"
      >
        <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm2-3a2 2 0 11-4 0 2 2 0 014 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"></path>
      </svg>
    </div>
  );
}

export function AiIcon() {
  return (
    <div className="rounded-full bg-gray-100 border p-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        strokeWidth="1.5"
        aria-hidden="true"
        viewBox="0 0 24 24"
      >
        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zm8.446-7.189L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zm-1.365 11.852L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"></path>
      </svg>
    </div>
  );
}

export function RecordIcon(props) {
  const { listening } = props;
  return (
    <button
      onContextMenu={(e) => e.preventDefault()}
      className={`p-5 rounded-full ${
        listening === "true" ? "bg-green-400" : "bg-gray-200"
      } hover:bg-gray-300 focus:outline-none`}
      {...props}
      listening={listening.toString()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-10 h-10"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
        />
      </svg>
    </button>
  );
}

export const SpeechButton = (props) => {
  return (
    <button
      onContextMenu={(e) => e.preventDefault()}
      className={`pointer-events-none p-5 rounded-full focus:outline-none  focus:pointer-events-auto
    ${props.listening ? "bg-green-300" : "bg-gray-200"}
  `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-10 h-10"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
        />
      </svg>
    </button>
  );
};

export const Spinner = () => {
  return (
    <button type="button" className="bg-indigo-500 ..." disabled>
      <svg className="animate-spin h-10 w-10 mr-3 ..." viewBox="0 0 24 24"></svg>
      Processing...
    </button>
  );
};
