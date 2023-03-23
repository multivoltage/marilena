import { parse } from "node-html-parser";
import { EVENT_NAME_NEED_REFRESH_WEBSOCKET } from "../const";

// this method append before body script mandatory to catch refresh by server via websocket
export function inject(html: string): string {
  const root = parse(html);

  const scriptString = `
    <script>
    const socket = new WebSocket("ws://localhost:8080/socket");
  
    // Listen for messages
    socket.addEventListener("message", (event) => {
      const message = event.data;
      if(message === "${EVENT_NAME_NEED_REFRESH_WEBSOCKET}"){
        window.location.reload();
      }
    });
    </script>
    `;

  root.insertAdjacentHTML("beforeend", scriptString);
  return root.innerHTML;
}
