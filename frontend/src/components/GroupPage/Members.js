import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DetailedProfileCard from "./DetailedProfileCard";
import "./GroupPage.css";
import "./Members.css";

function Members({ memberships }) {
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const memberArray = Object.values(memberships);
  const [tab, setTab] = useState("allmembers");

  let displayArray = [];

  const curUser = memberships[user.id];
  if (!curUser) return <h1>Page Loading</h1>;
  const curUserStatus = curUser.Membership;
  const curUserHost = curUser.Membership.status === "host";
  const curUserCoHost = curUser.Membership.status === "co-host";

  const pendingArray = memberArray
    .filter((ele) => ele.Membership.status === "pending")
    .map((ele) => (
      <DetailedProfileCard
        key={ele.id}
        member={ele}
        host={curUserHost}
        coHost={curUserCoHost}
      />
    ));

  const allMemberArray = memberArray.map((ele) => (
    <DetailedProfileCard
      key={ele.id}
      member={ele}
      host={curUserHost}
      coHost={curUserCoHost}
    />
  ));
  const leadershipArray = memberArray
    .filter(
      (ele) =>
        ele.Membership.status === "host" || ele.Membership.status === "co-host"
    )
    .map((ele) => (
      <DetailedProfileCard
        key={ele.id}
        member={ele}
        host={curUserHost}
        coHost={curUserCoHost}
      />
    ));

  if (tab === "allmembers") displayArray = allMemberArray;
  else if (tab === "leadership") displayArray = leadershipArray;
  else displayArray = pendingArray;

  if (!displayArray.length) displayArray.push(<h1>No pending requests.</h1>);

  return (
    <>
      <div className="group-events-main-body-left event-tab-cards-left">
        <div className="group-details-upcoming-container">
          <p
            className={
              tab === "allmembers"
                ? "group-details-selected"
                : "group-details-not-selected "
            }
            onClick={() => setTab("allmembers")}
          >
            All members
          </p>
          <p
            className={
              tab === "leadership"
                ? "group-details-selected"
                : "group-details-not-selected "
            }
            onClick={() => setTab("leadership")}
          >
            Leadership team
          </p>
          {curUserStatus.status === "host" ||
          curUserStatus.status === "co-host" ? (
            <p
              className={
                tab === "pending"
                  ? "group-details-selected"
                  : "group-details-not-selected "
              }
              onClick={() => setTab("pending")}
            >
              Pending members
            </p>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="group-events-main-body-right event-tab-cards-right">
        {displayArray}
      </div>
    </>
  );
}

// <div className="group-details-members-tab-container">
//   {memberArray.map((ele) => <ProfileCard key={ele.id} member={ele} />)}
// </div>

export default Members;
