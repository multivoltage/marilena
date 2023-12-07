import { useQuery } from "react-query";
import { Response } from "../../routes/email-lang-variants";
import { Link, useParams } from "react-router-dom";

export const EmailVariants = () => {
  let { emailName } = useParams();

  const { data: list = [] } = useQuery<Response>(
    "email-list",
    () => fetch(`/api/email-list/${emailName}`).then((r) => r.json()),
    {
      enabled: !!emailName,
    },
  );

  return (
    <div>
      <p>Email variants:</p>

      <ul>
        {list.map(({ locale }) => {
          return (
            <li key={locale}>
              <Link to={locale}>{locale}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
