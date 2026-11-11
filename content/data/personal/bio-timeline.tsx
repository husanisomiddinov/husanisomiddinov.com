import type { ReactNode } from "react";

export interface GalleryPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface BioMilestone {
  id: string;
  /** Age at the time of this milestone. */
  age: number;
  /** Shown instead of a repeated age once age stops changing. */
  dateLabel?: string;
  content: ReactNode;
  /** Optional looping photo strip under the text. Every photo is shown at the same height, at its true shape. */
  gallery?: GalleryPhoto[];
  /** Optional photo strip placed inside the text, after paragraph number `midAfter` (1 = after the first paragraph). */
  midGallery?: GalleryPhoto[];
  midAfter?: number;
}

export const bioMilestones: BioMilestone[] = [
  {
    id: "english",
    age: 5,
    content: (
      <>
        <p>
          I come from Samarkand, an ancient caravan city in the middle of
          somewhere. I grew up on English cartoons. My dad started teaching me
          the basics when I was five, and I was fluent long before the school
          exams and the SAT thing showed up.
        </p>
        <p>
          I may take this whole thing for granted at times, but believe me, it
          was a huge privilege, and it paid off: a full merit scholarship to a
          competitive private school in town, a few mid-ranked college
          acceptances which I didn&apos;t pursue, and Discord, Reddit, and
          Twitter without end. English put the whole discourse on
          technological, philosophical, and whatever-ical thought a click away.
        </p>
        <p>
          But the biggest thing it gave me was the ability to teach myself.
          English was my caravan, a door to exploring the world far beyond the
          reaches of my Samarkand. And that, to me, is worth more than any
          bachelor&apos;s diploma.
        </p>
      </>
    ),
  },
  {
    id: "high-school",
    age: 16,
    midAfter: 2,
    midGallery: [
      {
        src: "/images/about/high-school-pose.webp",
        alt: "Me striking a pose in front of a school banner at night",
        width: 800,
        height: 1067,
      },
      {
        src: "/images/about/the-plague.webp",
        alt: "Me wearing a travel pillow and holding The Plague by Albert Camus",
        width: 800,
        height: 1067,
      },
    ],
    gallery: [
      {
        src: "/images/about/high-school-speaking.webp",
        alt: "Me speaking to a room, holding a notebook, in front of a bright window",
        width: 640,
        height: 480,
      },
      {
        src: "/images/about/silk-road-paper.webp",
        alt: "The abstract of my paper, Fragments of Power: Foucault and Disruptions and Disjunctures in the Silk Road Narratives",
        width: 1198,
        height: 861,
      },
    ],
    content: (
      <>
        <p>
          At sixteen I changed schools. An English-taught place, full of
          like-minded peers, or so I assumed. It was there that, for the first
          time, I was asked, in complete seriousness, what I wanted to do with
          my life. You know,
          pick-a-major-then-pursue-it-in-college-and-then-get-a-job kind of
          question. In most of the world a sixteen-year-old can&apos;t rent a
          car. They can&apos;t own a house legally. Nor have the right to vote.
          But you have to make that decision anyway, or someone else will
          decide for you.
        </p>
        <p>
          A few conversations at school, and I was swept into philosophy and
          politics. Why? Well, first of all, it was exotic. Tell an average
          Uzbek that you study the meaning of life and he will take you for an
          escapee from a psychiatric clinic or someone who has watched too much{" "}
          <em>True Detective</em> (Matthew McConaughey the goat). So philosophy
          I studied. Explored the caves with Plato. Learnt that Hobbes thought
          life was &ldquo;nasty, brutish, and short,&rdquo; and then lived to
          ninety-one. And most from Europe preached about glorious purpose to
          fulfill, but got wasted out in Bavarian bars or died in circumstances
          their biographers describe with great tact.
        </p>
        <p>
          At some point, Yale became my mission. It didn&apos;t work out.
          Neither the admission nor, as it turned out, the politics or
          philosophy (whichever it was). To make some reform, I&apos;d have to
          hand my hopes to a committee of people who had collectively decided
          to hate every Monday morning, who drank their flat whites beside
          stacks of paper that had sat untouched for months, and who would, in
          due course, produce a memo. I needed a field where my actions led to
          direct results, however good or bad the output was.
        </p>
        <p>That summer when I graduated from high school, I dropped social science.</p>
      </>
    ),
  },
  {
    id: "agora",
    age: 18,
    dateLabel: "Jan 2025",
    midAfter: 1,
    midGallery: [
      {
        src: "/images/about/agora/website.webp",
        alt: "The Agora website homepage",
        width: 878,
        height: 480,
      },
      {
        src: "/images/about/agora/office-wall.webp",
        alt: "The Agora office wall reading \"You will never walk alone\"",
        width: 360,
        height: 480,
      },
      {
        src: "/images/about/agora/group.webp",
        alt: "A group photo of Agora students and mentors in a courtyard",
        width: 640,
        height: 480,
      },
      {
        src: "/images/about/agora/telegram.webp",
        alt: "The Agora Telegram channel with over 2,000 subscribers",
        width: 806,
        height: 480,
      },
    ],
    gallery: [
      {
        src: "/images/about/agora/i-write.webp",
        alt: "Agora poster reading \"I write; therefore I am.\"",
        width: 221,
        height: 480,
      },
      {
        src: "/images/about/agora/team-cafe.webp",
        alt: "Three of us at a cafe table with a laptop",
        width: 640,
        height: 480,
      },
      {
        src: "/images/about/agora/atlas.webp",
        alt: "The cover of Atlas, Getting the Words Right",
        width: 371,
        height: 480,
      },
      {
        src: "/images/about/agora/on-writing-well.webp",
        alt: "On Writing Well by William Zinsser next to a laptop showing a slide",
        width: 360,
        height: 480,
      },
      {
        src: "/images/about/agora/books.webp",
        alt: "A table of books for our writing mentors, including Gödel, Escher, Bach, Surely You're Joking, Mr. Feynman and On Writing",
        width: 480,
        height: 640,
      },
    ],
    content: (
      <>
        <p>
          At 18, I had this little project called{" "}
          <a
            href="https://www.agorawriting.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Agora
          </a>{" "}
          that I founded in January 2025. Agora connected students with
          creative writing mentors. I did everything: sales calls, custdevs,
          running the social media page, some bit of teaching on my end, and
          even pushed a few commits to GitHub to set up our website. Reached
          about 5k USD revenue per month and sold it off to a bigger{" "}
          <a
            href="https://satashkent.uz/"
            target="_blank"
            rel="noopener noreferrer"
          >
            educational company
          </a>{" "}
          in town early 2026.
        </p>
        <p>
          Agora helped me answer a question that&apos;s long been lingering in
          my mind: what I want to do with this life as a multi-celled
          organism. I knew I wanted to make some impact on the world (and ofc
          make money in the process). The purpose seemed to align with
          whatever moral compass I&apos;ve been born with. I don&apos;t know
          why specifically. I doubt anyone does. We just — do things.
        </p>
      </>
    ),
  },
  {
    id: "ai500",
    age: 19,
    dateLabel: "Nov 2025",
    gallery: [
      {
        src: "/images/about/ai500/hacking.webp",
        alt: "Two of us working on laptops at the AI500 hackathon, at the table for team Apollo",
        width: 719,
        height: 480,
      },
      {
        src: "/images/about/ai500/pitch-deck.webp",
        alt: "The title slide of our Apollo AI pitch deck",
        width: 876,
        height: 480,
      },
      {
        src: "/images/about/ai500/pitch-portrait.webp",
        alt: "Me pitching Apollo on stage at AI500",
        width: 320,
        height: 480,
      },
      {
        src: "/images/about/ai500/pitch-stage.webp",
        alt: "Presenting the Apollo plant disease detection slide to the AI500 audience",
        width: 720,
        height: 480,
      },
      {
        src: "/images/about/ai500/winners.webp",
        alt: "Our team holding the first place prize cheque at AI500",
        width: 720,
        height: 480,
      },
      {
        src: "/images/about/ai500/confetti.webp",
        alt: "Gold confetti falling as we hold the first place cheque",
        width: 702,
        height: 480,
      },
      {
        src: "/images/about/ai500/ceremony.webp",
        alt: "The AI500 award stage with all the winning teams and their cheques",
        width: 720,
        height: 480,
      },
    ],
    content: (
      <p>
        Before my Agora exit, I started getting technical. Did a few
        challenges to leaf through AI papers. Did the{" "}
        <a
          href="https://hackathons.uz/en/event/?id=1048"
          target="_blank"
          rel="noopener noreferrer"
        >
          AI500 hackathon
        </a>{" "}
        and somehow ended up getting the first place with 20k USD and an
        agri-tech project on machine vision.
      </p>
    ),
  },
  {
    id: "nuu",
    age: 19,
    dateLabel: "Jan 2026",
    gallery: [
      {
        src: "/images/about/nuu/quadruped.webp",
        alt: "A quadruped robot at the lab",
        width: 641,
        height: 480,
      },
      {
        src: "/images/about/nuu/humanoid-unboxing.webp",
        alt: "Unboxing a humanoid robot",
        width: 360,
        height: 480,
      },
      {
        src: "/images/about/nuu/lidar-robot.webp",
        alt: "A wheeled robot with a lidar sensor",
        width: 1093,
        height: 480,
      },
      {
        src: "/images/about/nuu/rviz-slam.webp",
        alt: "A SLAM map in RViz on a laptop screen",
        width: 640,
        height: 480,
      },
      {
        src: "/images/about/nuu/jetson-nano.webp",
        alt: "A Jetson Nano board on the bench",
        width: 360,
        height: 480,
      },
      {
        src: "/images/about/wpt-paper.webp",
        alt: "First page of the paper Multi-Object Charging in Room-Sized Weakly Coupled WPT System, from the lab I worked with",
        width: 495,
        height: 640,
      },
    ],
    content: (
      <p>
        Later joined a robotics lab in a local university and researched
        wireless power transfer for moving robots, sharing a lab with{" "}
        <a
          href="https://newuu.uz/en/employee/view/faculty-members/209"
          target="_blank"
          rel="noopener noreferrer"
        >
          Professor Belov
        </a>
        . Made some updates on my LinkedIn somewhere in the middle, and in no
        time I had found an offer from{" "}
        <a
          href="https://higgsfield.ai/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Higgsfield
        </a>{" "}
        in my inbox: growth manager.
      </p>
    ),
  },
  {
    id: "higgsfield",
    age: 19,
    dateLabel: "June 2026",
    gallery: [
      {
        src: "/images/about/higgsfield/office-meeting.webp",
        alt: "A meeting in the Higgsfield office",
        width: 640,
        height: 480,
      },
      {
        src: "/images/about/higgsfield/iman-gadzhi-billboard.webp",
        alt: "The Iman Gadzhi billboard at the Higgsfield office",
        width: 360,
        height: 480,
      },
      {
        src: "/images/about/higgsfield/desk-setup.webp",
        alt: "My desk setup at Higgsfield",
        width: 360,
        height: 480,
      },
    ],
    content: (
      <p>
        Joined Higgsfield. Worked very hard for 3 months. Hosted Iman Gadzhi
        in the office, talked about efficient computing with Yerzat Dulat (the
        CTO at Higgs), became a smoke buddy (I don&apos;t smoke. I was just
        watching) with one of the founding engineers, and burnt 100k USD in
        creator partnerships.
      </p>
    ),
  },
  {
    id: "quit",
    age: 19,
    dateLabel: "Sept 2026",
    content: (
      <p>
        In short, Higgs was fun, but I quit. I was working 90-100 hours per
        week on a startup that wasn&apos;t my own. The company scaled fast,
        but the scope of my work didn&apos;t seem to challenge me enough.
        After all, Higgsfield was an AI-media company. What really fascinated
        me was tweaking bolts on a robot part and nerding out on{" "}
        <a
          href="https://www.pi.website/"
          target="_blank"
          rel="noopener noreferrer"
        >
          π intelligence
        </a>{" "}
        papers.
      </p>
    ),
  },
];
