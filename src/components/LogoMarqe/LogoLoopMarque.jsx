import React from 'react'
import LogoLoop from '../reactBits/LogoLoop'
import {
  SiOpenai,
  SiGoogleads,
  SiMeta,

  SiMongodb,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiTensorflow,
  SiDocker,
  SiGithub
} from "react-icons/si";

const LogoLoopMarque = () => {
  const techLogos = [
    {
      node: <SiOpenai />,
      title: "ChatGPT / OpenAI",
      href: "https://openai.com",
    },
    {
      node: <SiMeta />,
      title: "Meta (Facebook & Instagram Ads)",
      href: "https://www.meta.com",
    },
    {
      node: <SiGoogleads />,
      title: "Google Ads & AdSense",
      href: "https://ads.google.com",
    },

    {
      node: <SiMongodb />,
      title: "MongoDB",
      href: "https://www.mongodb.com",
    },
    {
      node: <SiReact />,
      title: "React",
      href: "https://react.dev",
    },
    {
      node: <SiNextdotjs />,
      title: "Next.js",
      href: "https://nextjs.org",
    },
    {
      node: <SiNodedotjs />,
      title: "Node.js",
      href: "https://nodejs.org",
    },
    {
      node: <SiPython />,
      title: "Python",
      href: "https://www.python.org",
    },
    {
      node: <SiTensorflow />,
      title: "AI / Machine Learning",
      href: "https://www.tensorflow.org",
    },
    {
      node: <SiDocker />,
      title: "Docker",
      href: "https://www.docker.com",
    },
    {
      node: <SiGithub />,
      title: "GitHub",
      href: "https://github.com",
    },
  ];
  
  return (
    <div className="my-10">
      <div style={{ overflow: 'hidden' }}>
        <LogoLoop
          logos={techLogos}
          speed={100}
          direction="left"
          logoHeight={50}
          gap={50}
          hoverSpeed={0}
          scaleOnHover
          ariaLabel="Technology partners"
        />
      </div>
    </div>
  )
}

export default LogoLoopMarque