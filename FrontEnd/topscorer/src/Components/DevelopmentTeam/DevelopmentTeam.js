import React from 'react';
import styles from './DevelopmentTeam.module.css';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

// Profile data
const teamMembers = [
  {
    name: 'Piyush',
    role: 'Competitive Programmer',
    photo: 'https://media.licdn.com/dms/image/v2/D4D03AQHtL-rSZkdTTA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1684826021163?e=1730937600&v=beta&t=ncDWpv6tnUvr31h9KFV2jswsliX14Qqmmf2n4K_YBiY',
    linkedin: 'https://www.linkedin.com/in/piyush',
    github: 'https://github.com/piyush',
    twitter: 'https://twitter.com/piyush',
    details: 'Piyush is doing CP for about 6 months and has also contributed to the college website.'
  },
  {
    name: 'Prasoon',
    role: 'Backend Developer',
    photo: 'https://media.licdn.com/dms/image/v2/D5603AQHQ-iMnLYwqyw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1718269484577?e=1730937600&v=beta&t=JMwj76BS7lStBCBV2hMdek9sWtV-9nMi2jLaQTLatB4',
    linkedin: 'https://www.linkedin.com/in/prasoon',
    github: 'https://github.com/prasoon',
    twitter: 'https://twitter.com/prasoon',
    details: 'Prasoon is skilled in backend development and has worked on several high-performance projects.'
  },
  {
    name: 'Abhay',
    role: 'Frontend Developer',
    photo: 'https://media.licdn.com/dms/image/v2/D5635AQGw1tPk5E9eZw/profile-framedphoto-shrink_800_800/profile-framedphoto-shrink_800_800/0/1721932553216?e=1725796800&v=beta&t=d3wX40tRU5BT9LF4f2Oq4ragqQtyozxhf3Dyw0S9cJE',
    linkedin: 'https://www.linkedin.com/in/abhay',
    github: 'https://github.com/abhay',
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
