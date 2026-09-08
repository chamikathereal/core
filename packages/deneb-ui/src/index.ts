/**
 * DENEB UI — The Visual-First React Framework for High-Converting Storefronts
 * Created by Chamika Gayashan & Induranga Kawishwara
 */

export * from './EditableText';
export * from './EditableImage';
export * from './EditableList';
export * from './EditableBox';
export * from './EditableGrid';
export * from './EditableSection';
export * from './EditableProductCard';
export * from './EditableServiceCard';
export * from './EditableCard';
export * from './EditablePricingCard';
export * from './EditableTestimonialCard';
export * from './EditableFAQAccordion';
export * from './EditableContactForm';
export * from './EditableNavbar';
export * from './EditableFooter';
export * from './EditableHero';
export * from './EditableDialog';
export * from './EditableAnnouncementBar';
export * from './EditableCategoryPills';
export * from './StickyMobileBar';
export * from './TrustBadges';
export * from './ProductQuickView';
export * from './CookieConsentBanner';
export * from './ThemeStyles';
export * from './SiteDataProvider';

// Smart template components & actions
export * from './utils';
export * from './core';
export * from './contact';
export * from './location';
export * from './social';
export * from './business';

// Canonical DENEB UI Component Aliases (shadcn / HeroUI style)
export { EditableButton as Button } from './EditableText';
export { EditableCard as Card } from './EditableCard';
export { EditableDialog as Dialog } from './EditableDialog';
export { EditableText as Text } from './EditableText';
export { EditableHeading as Heading } from './EditableText';
export { EditableParagraph as Paragraph } from './EditableText';
export { EditableBadge as Badge } from './EditableText';
export { EditableQuote as Quote } from './EditableText';
export { EditableImage as Image } from './EditableImage';
export { EditableGrid as Grid } from './EditableGrid';
export { EditableSection as Section } from './EditableSection';
export { EditableBox as Box } from './EditableBox';
export { EditableList as List } from './EditableList';
export { EditableProductCard as ProductCard } from './EditableProductCard';
export { EditableServiceCard as ServiceCard } from './EditableServiceCard';
export { EditablePricingCard as PricingCard } from './EditablePricingCard';
export { EditableTestimonialCard as TestimonialCard } from './EditableTestimonialCard';
export { EditableFAQAccordion as Accordion, EditableFAQAccordion as FAQ } from './EditableFAQAccordion';
export { EditableContactForm as ContactForm } from './EditableContactForm';
export { EditableNavbar as Navbar, EditableNavbar as Header } from './EditableNavbar';
export { EditableFooter as Footer } from './EditableFooter';
export { EditableHeroCentered as Hero, EditableHeroSplit as HeroSplit } from './EditableHero';
export { EditableAnnouncementBar as AnnouncementBar } from './EditableAnnouncementBar';
export { EditableCategoryPills as CategoryPills } from './EditableCategoryPills';
export { StickyMobileBar } from './StickyMobileBar';
export { TrustBadges } from './TrustBadges';
export { ProductQuickView } from './ProductQuickView';
export { CookieConsentBanner } from './CookieConsentBanner';
export { FloatingContactWidget } from './contact/FloatingContactWidget';


/**
 * DENEB UI Framework Metadata
 * Developed by Chamika Gayashan & Induranga Kawishwara
 */
export const DENEB_FRAMEWORK_NAME = 'DENEB UI';
export const DENEB_FRAMEWORK_VERSION = '2.0.0';
export const DENEB_AUTHOR = 'Chamika Gayashan & Induranga Kawishwara';

// Backward compatibility alias
export const CEEG_FRAMEWORK_NAME = DENEB_FRAMEWORK_NAME;
export const CEEG_FRAMEWORK_VERSION = DENEB_FRAMEWORK_VERSION;
export const CEEG_AUTHOR = DENEB_AUTHOR;
