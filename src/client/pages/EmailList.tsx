import { Response } from "../../routes/email-list";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";

export const EmailList = () => {
  const { data: list = [] } = useQuery<Response>("email-list", () =>
    fetch("/api/email-list").then((r) => r.json()),
  );

  return (
    <div>
      <p>Email founded:</p>

      <ul>
        {list.map(({ emailName }) => {
          return (
            <li key={emailName}>
              <Link to={emailName}>{emailName}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
