import Image from 'next/image';
import Link from 'next/link';
import BeehiivEmbed from './BeehiivEmbed';

interface FooterProps {
  positioning?: 'absolute' | 'relative';
  topPosition?: string;
}

export default function Footer({ positioning = 'absolute', topPosition = '100vh' }: FooterProps) {
  const footerLinks = {
    expertise: [
      { label: 'Product Strategy', href: 'https://design1st.com/product-plan/' },
      { label: 'Industrial Design', href: 'https://design1st.com/industrial-design/' },
      { label: 'Mechanical Engineering', href: 'https://design1st.com/mechanical-engineering/' },
      { label: 'Embedded Software', href: 'https://design1st.com/embedded-software/' },
      { label: 'Electronics Design', href: 'https://design1st.com/electronic-design-services/' },
      { label: 'Prototype & Test', href: 'https://design1st.com/prototype-manufacturing-services/' },
      { label: 'Manufacture & Source', href: 'https://design1st.com/manufacturing/' },
    ],
    about: [
      { label: 'Company Bio', href: 'https://design1st.com/design-1st-2025-introduction.pdf' },
      { label: 'Meet the Team', href: 'https://design1st.com/company/' },
      { label: 'Our Process', href: 'https://design1st.com/product-development-process/' },
      { label: 'Read Reviews', href: 'https://design1st.com/reviews/' },
      { label: 'View Portfolio', href: 'https://design1st.com/portfolio-industry/' },
      { label: 'Newsroom', href: 'https://design1st.com/newsroom/' },
    ],
    toolsResources: [
      { label: 'Product Development Budget', href: 'https://tools.design1st.com/budget-tool' },
      { label: 'Find Funding Tool', href: 'https://tools.design1st.com/funding-tool' },
      { label: 'Visit Our Knowledge Hub', href: 'https://tools.design1st.com/' },
      { label: 'View Case Studies', href: 'https://design1st.com/case-studies/' },
      { label: 'Read Our Articles', href: 'https://design1st.com/resource-center/' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: '/footer/social-media/footer-facebook.svg', href: 'https://www.facebook.com/Design1st' },
    { name: 'Instagram', icon: '/footer/social-media/footer-instagram.svg', href: 'https://www.instagram.com/design_1st/#' },
    { name: 'LinkedIn', icon: '/footer/social-media/footer-linkedin.svg', href: 'https://ca.linkedin.com/company/design1st' },
    { name: 'YouTube', icon: '/footer/social-media/footer-youtube.svg', href: 'https://www.youtube.com/@Design1st' },
    { name: 'X (formerly Twitter)', icon: '/footer/social-media/footer-x.svg', href: 'https://x.com/Design_1st' },
  ];

  return (
    <footer
      className={`${positioning === 'absolute' ? 'absolute' : 'relative'} w-full z-10 flex flex-col`}
      style={positioning === 'absolute' ? { top: topPosition } : undefined}
    >
      {/* Main Footer Section */}
      <div className="bg-gray-200">
        <div className="px-6 sm:px-8 md:px-16 lg:px-16 xl:px-[120px] pt-4 md:pt-5 lg:pt-6 pb-6 md:pb-8 lg:pb-10 flex justify-center">
          {/* Main Content: 4 Columns */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap gap-6 lg:gap-8 xl:gap-24 justify-center">
            {/* Expertise Column */}
            <div className="flex flex-col gap-4">
              <h3 className="text-base font-semibold text-[#111111] border-b border-[#111111] pb-1">
                Design 1st Expertise
              </h3>
              <ul className="flex flex-col gap-[13px]">
                {footerLinks.expertise.map((link) => (
                  <li key={link.label} className="relative group">
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-[#111111] group-hover:text-[#ff6600] transition-colors inline-block relative pr-7"
                    >
                      <span>{link.label}</span>
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 32 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M8 12H26M26 12L19 5M26 12L19 19" stroke="#ff6600" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </a>
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff6600] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </li>
                ))}
              </ul>
            </div>

            {/* About Column */}
            <div className="flex flex-col gap-4">
              <h3 className="text-base font-semibold text-[#111111] border-b border-[#111111] pb-1">
                About Design 1st
              </h3>
              <ul className="flex flex-col gap-[13px]">
                {footerLinks.about.map((link) => (
                  <li key={link.label} className="relative group">
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-[#111111] group-hover:text-[#ff6600] transition-colors inline-block relative pr-7"
                    >
                      <span>{link.label}</span>
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 32 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M8 12H26M26 12L19 5M26 12L19 19" stroke="#ff6600" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </a>
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff6600] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tools & Resources Column */}
            <div className="flex flex-col gap-4">
              <h3 className="text-base font-semibold text-[#111111] border-b border-[#111111] pb-1">
                Tools & Resources
              </h3>
              <ul className="flex flex-col gap-[13px]">
                {footerLinks.toolsResources.map((link) => (
                  <li key={link.label} className="relative group">
                    <Link
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-base text-[#111111] group-hover:text-[#ff6600] transition-colors inline-block relative pr-7"
                    >
                      <span>{link.label}</span>
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 32 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M8 12H26M26 12L19 5M26 12L19 19" stroke="#ff6600" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </Link>
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff6600] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us Column */}
            <div className="flex flex-col gap-6">
              {/* Contact Section */}
              <div className="flex flex-col gap-4">
                <h3 className="text-base font-semibold text-[#111111] border-b border-[#111111] pb-1">
                  Contact Design 1st
                </h3>
                <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
                  {/* Book a Meeting */}
                  <a
                    href="https://calendly.com/design1st?utm_source=AI-Public-Footer&utm_medium=Knowledge-Hub&utm_campaign=calendly-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[#ff6600] hover:text-[#d95000] transition-colors font-semibold"
                  >
                    <Image src="/footer/footer-calendar.svg" alt="" width={16} height={16} />
                    <span className="text-base whitespace-nowrap">Book a Meeting</span>
                  </a>

                  {/* Phone */}
                  <a
                    href="tel:1-877-235-1004"
                    className="flex items-center gap-1.5 text-[#111111] hover:text-[#ff6600] transition-colors"
                  >
                    <Image src="/footer/footer-phone-black.svg" alt="" width={16} height={16} />
                    <span className="text-base whitespace-nowrap">1-877-235-1004</span>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:info@design1st.com"
                    className="flex items-center gap-1.5 text-[#111111] hover:text-[#ff6600] transition-colors"
                  >
                    <Image src="/footer/footer-email-black.svg" alt="" width={16} height={16} />
                    <span className="text-base whitespace-nowrap">info@design1st.com</span>
                  </a>
                </div>
              </div>

              {/* Newsletter Box */}
              <BeehiivEmbed />
            </div>
          </div>
        </div>
      </div>

      {/* Mini Footer - Copyright and Social Media */}
      <div className="bg-[#54565a] w-full">
        <div className="px-6 sm:px-8 md:px-16 lg:px-[120px] py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white text-center sm:text-left">
            © 2025 Design 1st. All Rights Reserved.
          </p>

          {/* Social Media Icons */}
          <div className="flex gap-4 items-center">
            {socialLinks.map((social) => {
              const isSmaller = social.name === 'Instagram' || social.name === 'X (formerly Twitter)';
              const size = isSmaller ? 17 : 24;

              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{ width: `${size}px`, height: `${size}px` }}
                  aria-label={social.name}
                >
                  <Image
                    src={social.icon}
                    alt=""
                    width={size}
                    height={size}
                    className="object-contain max-w-full max-h-full"
                  />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
