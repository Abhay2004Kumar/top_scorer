import React from 'react';
import styles from './DevelopmentTeam.module.css';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

// Profile data
const teamMembers = [
  {
    name: 'Prasoon',
    role: 'Competitive Programmer',
    photo: 'https://avatars.githubusercontent.com/u/73454209?v=4',

    linkedin: 'https://www.linkedin.com/in/prasoon-kushwaha-578ba3255/',
    github: 'https://github.com/Prasoon-kushwaha',
    twitter: 'https://x.com/PrasoonKushwah5',
    details: 'Prasoon is doing CP for about 6 months and has also contributed to the college website.'
  },
  {
    name: 'Piyush',
    role: 'Backend Developer',
    photo: 'https://iiitu.ac.in/DevTeam/PIYUSH%20YADAV.jpg',
    linkedin: 'https://www.linkedin.com/in/piyush-yadav-744806270/',
    github: 'https://github.com/piy3',
    twitter: 'https://twitter.com/prasoon',
    details: 'Piyush is skilled in backend development and has worked on several high-performance projects.'
  },
  {
    name: 'Abhay',
    role: 'Frontend Developer',
    photo: 'https://abhay-kumar-pfolio.netlify.app/static/media/about.d600f30a5e3894e45696.png',
    linkedin: 'https://www.linkedin.com/in/abhay-kumar-74b16124a/',
    github: 'https://github.com/Abhay2004Kumar',
    twitter: 'https://twitter.com/abhay',
    details: 'Abhay specializes in frontend development and is passionate about creating user-friendly interfaces.'
  },
];

function DevelopmentTeam() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Development Team</h1>
      <p className={styles.college}>All members are from <a href="https://iiitu.ac.in" className={styles.link}>IIIT Una</a></p>
      <div className={styles.team}>
        {teamMembers.map((member, index) => (
          <div key={index} className={styles.member}>
            <img src={member.photo} alt={member.name} className={styles.photo} />
            <h2 className={styles.name}>{member.name}</h2>
            <p className={styles.role}>{member.role}</p>
            <div className={styles.socialLinks}>
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className={styles.icon}>
                <FaLinkedin size={20} />
              </a>
              <a href={member.github} target="_blank" rel="noopener noreferrer" className={styles.icon}>
                <FaGithub size={20} />
              </a>
              <a href={member.twitter} target="_blank" rel="noopener noreferrer" className={styles.icon}>
                <FaTwitter size={20} />
              </a>
            </div>
            <p className={styles.details}>{member.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DevelopmentTeam;
