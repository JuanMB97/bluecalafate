import './social_media.css';
import { useTranslation } from 'react-i18next';
import type { SocialMediaProps } from '../../types';

function SocialMedia({ showTitle = true }: SocialMediaProps) {
  const { t } = useTranslation();

  return (
    <div className="container-social-media">
      {showTitle && <h4>{t('footer.follow_us', 'SEGUINOS EN')}</h4>}
      <div className="social-icons">
        <a
          href="https://www.instagram.com/bluecalafate"
          target="_blank"
          rel="noopener noreferrer"
          title="Instagram"
          className="social-ico instagram"
          aria-label="Instagram"
        >
          <i className="fi fi-brands-instagram"></i>
        </a>

        <a
          href="https://www.tiktok.com/@bluecalafate"
          target="_blank"
          rel="noopener noreferrer"
          title="TikTok"
          className="social-ico tiktok"
          aria-label="TikTok"
        >
          <i className="fi fi-brands-tik-tok"></i>
        </a>

        <a
          href="https://www.facebook.com/profile.php?id=100066924844790"
          target="_blank"
          rel="noopener noreferrer"
          title="Facebook"
          className="social-ico facebook"
          aria-label="Facebook"
        >
          <i className="fi fi-brands-facebook"></i>
        </a>
      </div>
    </div>
  );
}

export { SocialMedia };