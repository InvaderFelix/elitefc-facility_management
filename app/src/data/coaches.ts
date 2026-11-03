export interface Coach {
  id: string;
  name: string;
  role: string;
  image?: string;
  experience: string;
  bio: string;
}

export const COACHES: Coach[] = [
  {
    id: "nikky",
    name: "Nikky Zakoski",
    role: "Football Intelligence · Strength and Conditioning Coach · Elite360",
    image: "/assets/img/card-nikky.jpg",
    experience: "Football Intelligence lead",
    bio: "Leads the Football Intelligence side of <span className=\"elite360-green\">Elite360</span>: the part of the game that happens before the ball arrives. Trains players to scan earlier, position themselves smarter, and make faster decisions under pressure, so the game slows down for them on match day. As a strength and conditioning coach, ties that mental work to the physical so players execute at speed and under fatigue, the way real matches demand it.",
  },
  {
    id: "juan",
    name: "Juan Toro",
    role: "Athlete Performance · Health & Fitness Coach · Elite360",
    image: "/assets/img/card-juan.jpg",
    experience: "10 years PT studio · Essendon Royals FC Strength and Conditioning since 2019",
    bio: "Transforming lives, one body at a time. Son of a professional football player, born in Santiago and raised in Melbourne. Treats the whole person, nutrition, movement, sleep, and lifestyle, building sustainable habits rather than quick fixes. Founded and ran his own PT studio in Essendon for ten years and has served as Strength and Conditioning Coach at Essendon Royals FC since 2019.",
  },
  {
    id: "rodrigo",
    name: "Rodrigo Aguilera Leon",
    role: "Football Coach · Elite360",
    image: "/assets/img/card-rodrigo.jpg",
    experience: "Professional player 2004–2011",
    bio: "Played at a high professional level from 2004 to 2011, and has coached inside Victoria's youth football system since 2019. A qualified PE teacher and sport science coach, he develops players, educates them, and builds athletes. Experience includes National Premier Leagues (NPL) strength and conditioning at Green Gully, Technical Director of MiniRoos at Westgate FC, and Under 20s at Hume City.",
  },
  {
    id: "valentina",
    name: "Valentina Diaz Quinones",
    role: "Female Performance · Football Coach · Elite360",
    image: "/assets/img/card-valentina.jpg",
    experience: "Professional footballer · Colombia · Brazil · Australia",
    bio: "A professional Colombian footballer who has played competitively in Colombia, Brazil, and Australia. Plays mainly as a striker and attacking midfielder, known for her intensity, reading of the game, discipline, and commitment. As a current professional following the same pathway, training with her makes the pathway feel more achievable for young female players.",
  },
  {
    id: "jaden",
    name: "Jaden Tran",
    role: "Strength and Conditioning Coach · Elite360",
    image: "/assets/img/card-jaden.jpg",
    experience: "Physical platform specialist",
    bio: "Builds the physical platform underneath every player: speed, strength, power, and the resilience to handle a full season of high-level football. His programs are age-appropriate and progressive, meeting each player where they are and moving them forward safely. Injury prevention runs through everything, from movement quality screening to load management.",
  },
  {
    id: "agustin",
    name: "Agustin Capalbo",
    role: "Goalkeeper Performance Coach",
    image: "/assets/img/card-agustin.jpg",
    experience: "All age groups · First gloves to National Premier Leagues (NPL)",
    bio: "Runs specialist goalkeeper coaching at <span className=\"elite360-green\">Elite360</span>, an area most young keepers never get real access to at club level. Sessions cover the full craft: handling, footwork, positioning, shot-stopping, distribution, and commanding the box. Works with keepers from a first pair of gloves through to those pushing for National Premier Leagues (NPL) football.",
  },
  {
    id: "sebastian",
    name: "Sebastian Bernal",
    role: "Football Coach · Elite360",
    image: "/assets/img/card-sebastian.jpg",
    experience: "Professional · Colombia · Brazil (7 years) · Bolivia · Australia",
    bio: "A professional player with experience in Colombia, Brazil, where he played professionally for seven years, Bolivia, and now Australia. Passionate about developing players who are technically strong with a great understanding of the game. Creates a positive environment where players improve on and off the pitch.",
  },
  {
    id: "matias",
    name: "Matias Contreras",
    role: "Football Coach · Elite360",
    image: "/assets/img/card-matias.jpg",
    experience: "Elite FC U11 · U12/13 Girls · U8",
    bio: "Builds technical foundations and game understanding session by session. Focuses on clean execution of the basics, then layers in decision-making so players know not just how to perform an action, but when and why. Coaches the U11 Kangaroos, the U12/13 Girls Kangaroos, and the U8 Wallabies across the junior pathway.",
  },
];

export const ORDERED_IDS = [
  "rodrigo",
  "matias",
  "valentina",
  "agustin",
  "jaden",
  "sebastian",
  "juan",
  "nikky",
];

export const COACHES_BY_ID: Record<string, Coach> = Object.fromEntries(
  COACHES.map((coach) => [coach.id, coach]),
);
