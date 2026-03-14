import {
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { homepageStaticContent } from "@/content-models/homepage-content";

const socialIconMap = {
  GitHub: GithubIcon,
  LinkedIn: LinkedinIcon,
  X: TwitterIcon,
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  YouTube: YoutubeIcon,
} as const;

function getSocialIcon(title: string) {
  switch (title) {
    case "GitHub":
      return socialIconMap.GitHub;
    case "LinkedIn":
      return socialIconMap.LinkedIn;
    case "X":
      return socialIconMap.X;
    case "Facebook":
      return socialIconMap.Facebook;
    case "Instagram":
      return socialIconMap.Instagram;
    case "YouTube":
      return socialIconMap.YouTube;
    default:
      return GithubIcon;
  }
}

export function SiteFooter() {
  const { footer } = homepageStaticContent;

  return (
    <footer className="bg-white">
      <div className="mx-auto w-full max-w-[var(--site-max-width)] px-4 pt-2 pb-10 sm:px-6 lg:px-8">
        <Separator className="bg-[var(--bber-border)]" />
        <div className="flex flex-col items-center gap-5 pt-6 text-center">
          <p className="text-sm leading-7 text-[var(--bber-ink)]/80">
            <span className="block font-semibold text-[var(--bber-ink)]">
              {footer.organization}
            </span>
            <span className="block">{footer.address}</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {footer.socialLinks.map((socialLink) => {
              const SocialIcon = getSocialIcon(socialLink.title);

              return (
                <Link
                  key={socialLink.url}
                  href={socialLink.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex size-10 items-center justify-center rounded-full border border-[var(--bber-border)] text-[var(--bber-red)] transition-colors hover:bg-[var(--bber-sand)] hover:text-[var(--bber-red-strong)]"
                  aria-label={socialLink.title}
                >
                  <SocialIcon className="size-4" />
                </Link>
              );
            })}
            <span className="text-sm font-semibold tracking-[0.08em] text-[var(--bber-ink)]/70">
              @UNMBBER
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
