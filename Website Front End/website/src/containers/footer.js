import React from 'react';
import Footer from '../components/footer'

export function FooterContainer() {
	return (
		<Footer>
			<Footer.Wrapper>
				<Footer.Row>
					<Footer.Column>
						<Footer.Title>About Us</Footer.Title>
						<Footer.Link href="#">Story</Footer.Link>
						<Footer.Link href="#">Clients</Footer.Link>
						<Footer.Link href="#">Testimonials</Footer.Link>
					</Footer.Column>
					<Footer.Column>
						<Footer.Title>Services</Footer.Title>
						<Footer.Link href="#">Marketing</Footer.Link>
						<Footer.Link href="#">Consulting</Footer.Link>
						<Footer.Link href="#">Development</Footer.Link>
						<Footer.Link href="#">Design</Footer.Link>
					</Footer.Column>
					<Footer.Column>
						<Footer.Title>Contact Us</Footer.Title>
						<Footer.Link href="#">India</Footer.Link>
						<Footer.Link href="#">US</Footer.Link>
						<Footer.Link href="#">UK</Footer.Link>
						<Footer.Link href="#">Australia</Footer.Link>
					</Footer.Column>
					<Footer.Column>
						<Footer.Title>Social</Footer.Title>
						<Footer.Link href="#">Facebook</Footer.Link>
						<Footer.Link href="#">Instagram</Footer.Link>
						<Footer.Link href="#">Youtube</Footer.Link>
						<Footer.Link href="#">Twitter</Footer.Link>
					</Footer.Column>
				</Footer.Row>
			</Footer.Wrapper>
		</Footer>
	)
}