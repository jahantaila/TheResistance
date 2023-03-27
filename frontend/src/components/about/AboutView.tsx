import { useEffect, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Figure from "react-bootstrap/esm/Figure";
import Row from "react-bootstrap/esm/Row";
import { Link } from "react-router-dom";
import s from "./AboutView.module.scss";

type ConnectedStatistics = {
  players: number;
  lobbies: number;
  games: number;
};

export default function AboutView() {
  const [stats, setStats] = useState<ConnectedStatistics | null>(null);

  useEffect(() => {
    const fetch = () => {
      window
        .fetch("/api/statistics")
        .then((res) => res.json())
        .then((val: ConnectedStatistics) => setStats(val))
        .catch(console.error);
    };
    fetch();
    const interval = setInterval(fetch, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={s.AboutView}>
      <Link className={s.back} to="..">
        Back to homepage
      </Link>
      <Container>
        <Row>
          <Col xs={0} lg={1} />
          <Col xs={12} lg={10} className={s.container}>
            <h1 className={s.title}>The Resistance</h1>

              
              
            <p>
            The year is 2065, and the world is a vastly different place. Governments have collapsed, corporations rule the world, and resistance movements have risen to fight against the oppressive regimes.

The Resistance, a secret society of rebels, was formed to overthrow the powerful corporations and bring freedom to the people. But the corporations are always watching, and the Resistance must operate in secrecy to avoid being discovered.

You are a member of the Resistance, recruited for your unique skills and abilities. You have been trained in deception, strategy, and combat, and you are ready to fight for the cause.

One day, you receive a mysterious message from an anonymous source, inviting you to a secret meeting. You are instructed to bring no identification, and to come alone.

You arrive at a dark, secluded location, where you are greeted by a group of strangers. They introduce themselves as fellow members of the Resistance, and explain that they have a mission for you.

They tell you that the corporations have developed a new technology that will allow them to spy on all Resistance communications. They need a team to go on a mission to destroy this technology and prevent the corporations from gaining even more power.

You are chosen to lead the mission, and you select a team of trusted operatives to accompany you. But as the mission progresses, you begin to suspect that one of your team members may be a spy, working for the corporations.

The tension mounts as you and your team must navigate the challenges of the mission while trying to uncover the spy's identity. The fate of the Resistance rests in your hands, and every decision you make could be the difference between victory and defeat.

As the game of The Resistance unfolds, you find yourself drawn deeper into the world of the rebellion. You learn more about the motivations and struggles of your fellow rebels, and begin to understand the true stakes of the fight against the corporations.

Through your triumphs and failures, you become an integral part of the Resistance, and play a pivotal role in the battle for freedom and justice.
            </p>
            <Figure className={s.image}>
              <Figure.Image
                src={`${process.env.PUBLIC_URL}/doc/demo.png`}
                alt="Demo"
                width={800}
              ></Figure.Image>
            </Figure>
            {stats && (
              <p className={s.light}>
                <span>
                  Users Connected: {stats.players} | Lobbies: {stats.lobbies} |
                  Games: {stats.games}
                </span>
              </p>
            )}
          </Col>
          <Col xs={0} lg={1} />
        </Row>
      </Container>
    </div>
  );
}
