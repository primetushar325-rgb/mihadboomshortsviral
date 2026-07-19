import { db } from "@/db";
import { packages, sections, banners, notices, testimonials, faqs, gallery } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { getSettings } from "@/lib/settings";
import { buildWhatsAppLink } from "@/lib/format";

import Header from "@/components/Header";
import NoticeBoard from "@/components/NoticeBoard";
import Hero from "@/components/Hero";
import OfferBanners from "@/components/OfferBanners";
import FeaturedVideo from "@/components/FeaturedVideo";
import PackagesSection from "@/components/PackagesSection";
import CustomSections from "@/components/CustomSections";
import Testimonials from "@/components/Testimonials";
import GallerySection from "@/components/GallerySection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import VisitPing from "@/components/VisitPing";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const s = await getSettings();

  const [allPackages, allSections, allBanners, allNotices, allTestimonials, allFaqs, allGallery] =
    await Promise.all([
      db.select().from(packages).orderBy(asc(packages.sortOrder), asc(packages.id)),
      db.select().from(sections).where(eq(sections.visible, true)).orderBy(asc(sections.sortOrder)),
      db.select().from(banners).where(eq(banners.visible, true)).orderBy(asc(banners.sortOrder)),
      db.select().from(notices).where(eq(notices.visible, true)).orderBy(asc(notices.sortOrder)),
      db.select().from(testimonials).where(eq(testimonials.visible, true)).orderBy(asc(testimonials.sortOrder)),
      db.select().from(faqs).where(eq(faqs.visible, true)).orderBy(asc(faqs.sortOrder)),
      db.select().from(gallery).where(eq(gallery.visible, true)).orderBy(asc(gallery.sortOrder)),
    ]);

  const boomPackages = allPackages.filter((p) => p.category === "boom" && p.visible);
  const servicePackages = allPackages.filter((p) => p.category === "service" && p.visible);

  const whatsappLink = s.whatsappLink || buildWhatsAppLink(s.whatsappNumber, "Hi, I want to order a package.");

  return (
    <main className="min-h-screen bg-slate-950">
      <VisitPing />
      <Header siteName={s.siteName} />
      <NoticeBoard notices={allNotices} />

      <Hero
        badgeText={s.heroBadgeText}
        title={s.heroTitle}
        subtitle={s.heroSubtitle}
        stats={[
          { label: "Happy Clients", value: s.statHappyClients },
          { label: "Completed Orders", value: s.statCompletedOrders },
          { label: "SEO Optimized", value: s.statSeoOptimized },
        ]}
        offer={{
          enabled: s.offerEnabled,
          text: s.offerText,
          endsAt: s.offerEndsAt ? new Date(s.offerEndsAt).toISOString() : null,
        }}
      />

      <OfferBanners banners={allBanners} />

      <FeaturedVideo
        videoUrl={s.youtubeVideoUrl}
        thumbnailUrl={s.youtubeThumbnailUrl}
        title={s.youtubeTitle}
      />

      <PackagesSection
        id="boom-shorts"
        eyebrow="Boom Shorts"
        title="Boom Shorts Packages"
        subtitle="High retention Boom Shorts videos crafted to go viral — pick a plan that fits your channel."
        packages={boomPackages.map((p) => ({ ...p, oldPrice: p.oldPrice, newPrice: p.newPrice }))}
      />

      <PackagesSection
        id="services"
        eyebrow="Other Services"
        title="Thumbnail, SEO, Editing & More"
        subtitle="Everything else your channel needs — from scroll-stopping thumbnails to full SEO optimization."
        packages={servicePackages.map((p) => ({ ...p, oldPrice: p.oldPrice, newPrice: p.newPrice }))}
      />

      <CustomSections sections={allSections} />

      <Testimonials items={allTestimonials} />

      <GallerySection items={allGallery} />

      <FAQSection items={allFaqs} />

      <Footer
        siteName={s.siteName}
        whatsappLink={whatsappLink}
        facebookLink={s.facebookLink}
        messengerLink={s.messengerLink}
        telegramLink={s.telegramLink}
      />

      <FloatingButtons
        whatsappLink={whatsappLink}
        messengerLink={s.messengerLink}
        freeVideoLink={s.freeVideoLink}
      />
    </main>
  );
}
