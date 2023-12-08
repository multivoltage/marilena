import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { SERVER_PORT } from "../../const.js";

let socket: WebSocket;
export const Email = () => {
  let { emailName, locale } = useParams();
  const formRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // edit title
    document.title = `${emailName} - ${locale}`;

    // setup socket
    socket = new WebSocket(`ws://localhost:8080`);

    socket.addEventListener("open", (event) => {
      console.log("socket open");
    });
    // Listen for messages
    socket.addEventListener("message", (event) => {
      const message = event.data;
      if (message === "need_refresh") {
        formRef.current?.contentWindow?.location.reload();
      }
    });

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  return (
    <div className="email-frame-container">
      <iframe
        id="email-frame"
        ref={formRef}
        src={`/api/email-list/${emailName}/${locale}`}
      ></iframe>
    </div>
  );
};
