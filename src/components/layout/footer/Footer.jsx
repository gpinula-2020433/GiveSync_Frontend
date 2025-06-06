import React from 'react'
import './footer.css'
import fb from '../../../assets/fb.png'
import x from '../../../assets/x.png'
import linkedin from '../../../assets/linkedin.png'
import insta from '../../../assets/insta.png'

const Footer = () => {
  return (
    <div className='footer'>
        <div className='sb_footer section_padding'>
            <div className='sb_footer-links'>
                <div className='sb_footer-links_div'>
                    <h4>for business</h4>
                    <a href="/employer">
                        <p>Employer</p>
                    </a>
                    <a href="/healthplan">
                        <p>Health Plan</p>
                    </a>
                    <a href="/individual">
                        <p>Individual</p>
                    </a>
                </div>
                <div className='sb_footer-links_div'>
                    <h4>Resorurces</h4>
                    <a href="/resource">
                        <p>Resource center</p>
                    </a>
                    <a href="/resource">
                        <p>Testimonials</p>
                    </a>
                    <a href="/resource">
                        <p>STV</p>
                    </a>
                </div>
                <div className='sb_footer-links_div'>
                    <h4>Partners</h4>
                    <a href="/employer">
                        <p>Swing Tech</p>
                    </a>
                </div>
                <div className='sb_footer-links_div'>
                    <h4>Company</h4>
                    <a href="/about">
                        <p>About</p>
                    </a>
                    <a href="/press">
                        <p>Press</p> 
                    </a>
                    <a href="/career">
                        <p>Career</p>
                    </a>
                    <a href="/contac">
                        <p>Contact</p>
                    </a>
                </div>
                <div className='sb_footer-links_div'>
                    <h4>Coming soon on</h4>
                    <div className='socialmedia'>
                        <p><img src={fb} alt="" /> </p>
                        <p><img src={x} alt="" /> </p>
                        <p><img src={linkedin} alt="" /> </p>
                        <p><img src={insta} alt="" /> </p>
                    </div>
                </div>
            </div>

        <hr></hr>

        <div className='sb_footer-below'>
            <div className='sb_footer-copyright'>
                <p>
                    @{new Date().getFullYear()} Swing Health. All rights reserved.
                </p>
            </div>
            <div className='sb_footer-below-links'>
                <a href="/terms"><div><p>Terms & Conditions</p></div></a>
                <a href="/privacy"><div><p>Privacy</p></div></a>
                <a href="/securty"><div><p>Security</p></div></a>
                <a href="/cookie"><div><p>Cookie Declaration</p></div></a>
            </div>
        </div>

        </div>
    </div>
  )
}

export default Footer