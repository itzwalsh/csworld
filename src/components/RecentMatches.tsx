import React, { type FC } from "react";
import { LoadingSpinner } from "./loading";

import { Link } from "@nextui-org/react";
import Image from "next/image";
import { IoPerson, IoSkull } from "react-icons/io5";
import { AiOutlinePercentage } from "react-icons/ai";

interface Props {
  playerId: string;
  matchStatsArray: Array<{
    rounds: Array<{
      round_stats: {
        Map: string;
      };
      teams: Array<{
        players: Array<{
          player_id: string;
          player_stats: {
            Kills: string;
            Assists: string;
            Deaths: string;
            "K/D Ratio": string;
            "Headshots %": string;
          };
        }>;
        team_stats: {
          "Final Score": string;
          "Team Win": string;
          Team: string;
        };
      }>;
    }>;
  }> | null;
}

const MatchCard: FC<Props> = (props) => {
  return (
    <>
      {props.matchStatsArray?.slice(0, 3).map((match, i: number) => {
        if (match?.rounds[0]) {
          const map = match.rounds[0].round_stats.Map;
          const mapShort = map.replace("de_", "");
          const mapImageName = `/${mapShort}-background.png`;
          //const date = .... i dont think i can get this with this api call

          function findMyTeam() {
            const team1 = match.rounds[0]?.teams[0];
            // const team2 = match.rounds[0].teams[1];

            const playerInTeam1 = team1?.players.find(
              (player: any) => player.player_id === props.playerId
            );

            return playerInTeam1 ? 0 : 1;
          }

          function findMyStats() {
            const teamNumber = findMyTeam();
            const team = match.rounds[0]?.teams[teamNumber];
            const player = team?.players?.find(
              (player: any) => player?.player_id === props.playerId
            );
            const playerStats = player?.player_stats;

            if (!playerStats) {
              return {
                Kills: "-",
                Assists: "",
                Deaths: "",
                "K/D Ratio": "-",
                "Headshots %": "-",
              };
            }

            return playerStats;
          }

          return (
            <Link
              href="/maps/matchId"
              className="text-text transition-all duration-200 hover:-translate-y-2"
              key={i}
            >
              <div className="static col-span-12 h-[250px] w-[350px] min-w-[350px] max-w-[600px] sm:col-span-7 md:w-[450px]">
                <Image
                  src={mapImageName ?? "/mirage-background.png"}
                  alt="Map Image"
                  width={600}
                  height={250}
                  priority
                  className="relative rounded-md object-cover opacity-40"
                />
                <div className="absolute left-0 right-8 top-8 mx-auto w-72 rounded-md bg-zinc-950 py-3 md:right-24">
                  <span className="text-2xl font-bold uppercase">
                    {match.rounds[0].teams[findMyTeam()]?.team_stats[
                      "Team Win"
                    ] === "1" ? (
                      <p>
                        Victory{" "}
                        <span className="text-green-500">
                          {`${
                            match.rounds[0].teams[findMyTeam()]?.team_stats[
                              "Final Score"
                            ]
                          }`}
                        </span>{" "}
                        :{" "}
                        <span>
                          {`${
                            match.rounds[0].teams[findMyTeam() === 0 ? 1 : 0]
                              ?.team_stats["Final Score"]
                          }`}
                        </span>
                      </p>
                    ) : (
                      <p>
                        Defeat{" "}
                        <span className="text-red-500">
                          {`${
                            match.rounds[0].teams[findMyTeam()]?.team_stats[
                              "Final Score"
                            ]
                          }`}
                        </span>{" "}
                        :{" "}
                        <span>
                          {`${
                            match.rounds[0].teams[findMyTeam() === 0 ? 1 : 0]
                              ?.team_stats["Final Score"]
                          }`}
                        </span>
                      </p>
                    )}
                  </span>
                </div>
                <div className="absolute bottom-0 z-10 h-12 w-full rounded-b-md bg-zinc-950">
                  <div className="flex h-full items-center justify-around align-middle">
                    <div className="flex items-center justify-center gap-1">
                      <IoPerson />
                      {match.rounds[0].teams[findMyTeam()]?.team_stats.Team}
                    </div>

                    <div className="flex items-center justify-center gap-1">
                      <IoSkull />
                      {findMyStats().Kills +
                        "-" +
                        findMyStats().Assists +
                        "-" +
                        findMyStats().Deaths}
                    </div>
                    <div className="flex items-center justify-center">
                      H/S {findMyStats()["Headshots %"] || "-"}
                      <AiOutlinePercentage />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        }
        return null;
      })}
    </>
  );
};

const RecentMatches: FC<Props> = (props) => {
  return props.matchStatsArray?.length != 0 ? (
    <MatchCard
      matchStatsArray={props.matchStatsArray}
      playerId={props.playerId}
    />
  ) : (
    <LoadingSpinner size={36} />
  );
};

export default RecentMatches;
