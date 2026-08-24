import instagramIco from '../../assets/instagram.png';
import tiktokIco from '../../assets/tiktok.png';
import facebookIco from '../../assets/facebook.png';

function SocialMedia() {
  return (
    <div>
      <h4>SEGUINOS EN</h4>
      <div className="social-icons">
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          title="Instagram"
        >
          <img src={instagramIco} alt="Instagram" className="fa-brands fa-instagram" />
        </a>

        <a
          href="https://www.tiktok.com/"
          target="_blank"
          rel="noopener noreferrer"
          title="TikTok"
        >
          <img src={tiktokIco} alt="TikTok" className="fa-brands fa-tiktok" />
        </a>

        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
          title="Facebook"
        >
          <img src={facebookIco} alt="Facebook" className="fa-brands fa-facebook-f" />
        </a>
      </div>
    </div>
  );
}

export { SocialMedia };