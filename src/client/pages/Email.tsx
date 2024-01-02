import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { SERVER_PORT } from "../../const.js";
import { useMutation, useQuery } from "react-query";
import type { Params } from "../../routes/post-send-email.js";
import ReactModal from "react-modal";
import { SerializedConfig } from "src/routes/get-config.js";

let socket: WebSocket;
export const Email = () => {
  let { emailName, locale } = useParams();
  const formRef = useRef<HTMLIFrameElement>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [sendTo, setSendTo] = useState("");
  const [fillFakeMetaData, setFillFakeMetaData] = useState(false);

  const { data: config } = useQuery<SerializedConfig>("getConfig", () =>
    fetch("/api/config").then((r) => r.json()),
  );
  const { mutate, data, isLoading } = useMutation({
    mutationFn: (params: Params) =>
      fetch("/api/send", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        //make sure to serialize your JSON body
        body: JSON.stringify(params),
      }).then((r) => r.json()),
  });

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

  useEffect(() => {
    if (!!data) {
      setModalOpen(true);
    }
  }, [data]);

  useEffect(() => {
    const sendTo = config?.sendTestOptions?.to;
    if (sendTo) {
      setSendTo(sendTo);
    }
  }, [config]);

  function sendEmail() {
    if (emailName && locale && config?.sendTestOptions?.to) {
      const params = {
        email: emailName,
        locale,
        to: sendTo,
        fillFakeMetaData,
      };

      mutate(params);
    }
  }

  function closeModal() {
    setModalOpen(false);
  }

  function handleChangeEmail(e: React.ChangeEvent<HTMLInputElement>) {
    setSendTo(e.currentTarget.value);
  }

  function handleChangeFillFakeData(e: React.ChangeEvent<HTMLInputElement>) {
    setFillFakeMetaData(e.target.checked);
  }

  return (
    <div className="page-wrapper">
      <div className="email-frame-container">
        <iframe
          id="email-frame"
          ref={formRef}
          src={`/api/email-list/${emailName}/${locale}?fillFakeMetaData=${String(
            fillFakeMetaData,
          )}`}
        ></iframe>
      </div>

      <div className="send-to">
        <input type="email" placeholder={sendTo} onChange={handleChangeEmail} />
        <button onClick={sendEmail}>
          {isLoading ? "loading..." : "send email"}
        </button>
        <br />

        <div>
          <input
            type="checkbox"
            id="scales"
            name="scales"
            checked={fillFakeMetaData}
            onChange={handleChangeFillFakeData}
          />
          <label htmlFor="scales">Fill with fake data</label>
        </div>
      </div>

      <ReactModal isOpen={isModalOpen}>
        <div className="send-to__modal">
          <button onClick={closeModal} className="">
            X
          </button>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </ReactModal>
    </div>
  );
};
