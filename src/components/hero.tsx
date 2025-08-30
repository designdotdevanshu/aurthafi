import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { GithubIcon } from "lucide-react";

function HeroSection() {
  return (
    <div className="mt-20 flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="gradient-title pb-6 text-center text-[clamp(2rem,6vw,5rem)] font-bold">
              Manage Your Finances <br />
              <span className="mt-1 text-[clamp(3rem,7vw,6rem)] font-bold leading-none">
                with Intelligence
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
              An AI-powered financial management platform that helps you track,
              analyze, and optimize your spending with real-time insights.
            </p>
            <div className="mb-8 flex justify-center space-x-4">
              <Link href="/dashboard">
                <Button size="lg" className="px-8">
                  Get Started
                </Button>
              </Link>
              <a
                href="https://github.com/designdotdevanshu/aurthafi"
                target="_blank"
                rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="px-8">
                  <GithubIcon size={20} />
                  View on GitHub
                </Button>
              </a>
            </div>
          </>
        }>
        <Image
          src="/banner.jpeg"
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto h-full rounded-lg object-cover object-center"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}

export { HeroSection };
