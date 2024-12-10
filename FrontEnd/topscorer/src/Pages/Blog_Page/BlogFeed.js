import React, { useState } from 'react';
import { FaThumbsUp, FaComment, FaShareAlt } from 'react-icons/fa';
import styles from '../Blog_Page/Blog.module.css'; // Ensure correct path to CSS module
import toast from 'react-hot-toast';

const BlogFeed = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null); // To store the blog that was clicked
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: 'IT Beats CSE to get into finals, Lots of Mistake by CSE to Note {IIIT Una}',
      content: 'In a thrilling match held on the 23rd of September, the IT team outperformed expectations by beating the CSE team. This victory comes after a series of intense training sessions and strategic game plans. Despite a few mistakes on the part of CSE, the match was a testament to the competitive spirit at IIIT Una.',
      author: 'Prasoon Kushwaha',
      date: 'Monday 23, Sept 2024',
      imageUrl: 'https://images.pexels.com/photos/3800517/pexels-photo-3800517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      comments: [
        {
          name: 'Ramu',
          date: 'Monday 23, Sept 2024',
          message: 'Incredible match! The IT team really pulled through.'
        },
        {
          name: 'Shyamu',
          date: 'Monday 23, Sept 2024',
          message: 'CSE team made a lot of mistakes, but still a fun match to watch!'
        },
      ],
      likes: ['Ramu', 'Shyamu'],
    },
    {
      id: 2,
      title: 'CSE Won Kho-Kho Finals! Thanks to Sanket',
      content: 'The Kho-Kho finals saw an incredible performance from the CSE team, led by the strategic genius of Sanket. His leadership on the field and tactical decisions played a pivotal role in securing the championship. The final score was 15-10, showcasing a well-fought battle that kept everyone on the edge of their seats.',
      author: 'Ankur Yadav CSE',
      date: 'Tuesday 24, Oct 2024',
      imageUrl: 'https://thedailyguardian.com/wp-content/uploads/2021/02/83123313_1704_P_5_mr.jpg',
      comments: [
        {
          name: 'John Doe',
          date: 'Tuesday 24, Oct 2024',
          message: 'Amazing strategy by Sanket! Truly an unforgettable final.'
        },
      ],
      likes: ['John Doe'],
    },
    {
      id: 3,
      title: 'Battle of Brains, CSE Won Chess in Yalgaar 2024',
      content: 'At Yalgaar 2024, the CSE team showcased their strategic prowess by clinching victory in the chess tournament. With a series of brilliant moves and deep thinking, the team demonstrated that they were not just programmers but also exceptional strategists. The excitement in the air was palpable as they claimed the trophy amidst cheers from their fellow students.',
      author: 'John Smith',
      date: 'Wednesday 25, Sept 2024',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Chess_pieces_close_up.jpg/800px-Chess_pieces_close_up.jpg',
      comments: [
        {
          name: 'Ravi',
          date: 'Wednesday 25, Sept 2024',
          message: 'Such an exciting tournament! The CSE team’s victory was well-deserved.'
        },
      ],
      likes: ['Ravi'],
    },
    {
      id:  4,
      title: 'The Thrill of the Run: CSE Marathon Highlights',
      content: 'The CSE Marathon held on the campus attracted participants from various departments, all vying for the title. With a record number of participants this year, the event showcased not only athleticism but also community spirit. The finish line was a sea of excitement as the first runners crossed, celebrating their hard work and dedication.',
      author: 'Neha Sharma',
      date: 'Saturday 1, Oct 2024',
      imageUrl: 'https://cdn.prod.website-files.com/5f58a4616a9e71d63ca059c8/63eb9c9bc0c7e518fd04ee67_MG1_2798.webp',
      comments: [
        {
          name: 'Sonia Gupta',
          date: 'Saturday 1, Oct 2024',
          message: 'Great event! Loved the community vibe at the marathon.'
        },
      ],
      likes: ['Sonia Gupta'],
    },
    {
      id:  5,
      title: 'Basketball Championship: A Match for the Ages',
      content: 'In an exhilarating championship game, the IIIT Una basketball team faced off against their long-time rivals. With nail-biting moments and spectacular plays, the game kept fans on the edge of their seats. Ultimately, the home team secured a hard-fought victory, earning the championship trophy amidst roaring cheers.',
      author: 'Ravi Verma',
      date: 'Sunday 2, Oct 2024',
      imageUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?cs=srgb&dl=pexels-markusspiske-1752757.jpg&fm=jpg',
      comments: [
        {
          name: 'Manoj',
          date: 'Sunday 2, Oct 2024',
          message: 'Such an exciting match, I couldn’t take my eyes off the game!'
        },
      ],
      likes: ['Manoj'],
    },
    {
      id: 6,
      title: 'Table Tennis Tournament: Skill and Precision on Display',
      content: 'The annual Table Tennis Tournament was a showcase of skill and precision, with competitors battling it out in thrilling matches. The finals were particularly exciting, featuring an intense showdown between last year’s champion and an up-and-coming player. In the end, it was a nail-biter, with the crowd cheering for every point.',
      author: 'Sonia Gupta',
      date: 'Monday 3, Oct 2024',
      imageUrl: 'https://media.self.com/photos/5c360cc973e3cb2ca1e0fd35/4:3/w_2560%2Cc_limit/table-tennis.jpg',
      comments: [
        {
          name: 'Ravi Verma',
          date: 'Monday 3, Oct 2024',
          message: 'The final was crazy! So much intensity on every point.'
        },
      ],
      likes: ['Ravi Verma'],
    },
    {
      id:  7,
      title: 'Football Finals: CSE Triumphs Against IT',
      content: 'The football finals this year were nothing short of spectacular. The CSE team showed exceptional teamwork and skill, overcoming a strong IT team to claim the championship title. The match ended with a score of 3-1, and the players celebrated their hard work and dedication with their supporters.',
      author: 'Mohit Saini',
      date: 'Tuesday 4, Oct 2024',
      imageUrl: 'https://cdn.firstcry.com/education/2022/06/10173546/Essay-on-Football.jpg',
      comments: [
        {
          name: 'Neha Sharma',
          date: 'Tuesday 4, Oct 2024',
          message: 'CSE really brought their A-game! Well deserved win.'
        },
      ],
      likes: ['Neha Sharma'],
    },
    {
      id:  8,
      title: 'Ultimate Frisbee Tournament: A New Champion Emerges',
      content: 'The Ultimate Frisbee tournament concluded with a thrilling final that saw a new champion emerge. With dynamic plays and incredible teamwork, the underdogs claimed victory over the seasoned champions in a match that will be remembered for years to come. The tournament fostered a spirit of camaraderie and sportsmanship.',
      author: 'Anjali Mehta',
      date: 'Wednesday 5, Oct 2024',
      imageUrl: 'https://www.kidzherald.com/wp-content/uploads/2024/01/F-4.webp',
      comments: [
        {
          name: 'Sanket',
          date: 'Wednesday 5, Oct 2024',
          message: 'Such an unexpected turn of events! The underdogs were amazing.'
        },
      ],
      likes: ['Sanket'],
    },
  ]);

  // Open modal with selected blog content
  const openBlogModal = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
    toast.success('Opening detailed view of blog');
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null); // Clear selected blog when modal is closed
  };

  return (
    <>
      <div className={styles.blogFeedContainer}>
        <div className={styles.blogFeed}>
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className={styles.blogPost}
              onClick={() => openBlogModal(blog)}
            >
              <div className={styles.blogImage}>
                <img src={blog.imageUrl} alt={blog.title} className={styles.imageBox} />
              </div>
              <div className={styles.blogText}>
                <h2 className={styles.blogTitle}>{blog.title}</h2>
                <p className={styles.blogAuthorDate}>
                  Posted by {blog.author} on {blog.date}
                </p>
                <p className={styles.blogContent}>{blog.content}</p>
                <div className={styles.blogActions}>
                  <button className={styles.actionBtn}>
                    <FaThumbsUp /> Like
                  </button>
                  <button className={styles.actionBtn}>
                    <FaComment /> Comments
                  </button>
                  <button className={styles.actionBtn}>
                    <FaShareAlt /> Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for blog detail */}
      {isModalOpen ? (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeModal} onClick={closeModal}>
              Close
            </button>
            {selectedBlog ? (
              <div className={styles.modalBlogDetail}>
                 <h1>{selectedBlog.title}</h1>
                 <div className={styles.postInfo}>
                 <p className={styles.auth}>
                    <strong>Author:</strong> {selectedBlog.author}
                  </p>
                  <p className={styles.auth}>
                    <strong>On</strong> {selectedBlog.date}
                  </p>
                  </div>
                  <div className={styles.modalBlogContent}>
                  <div className={styles.modalBlogImage}>
                    <img src={selectedBlog.imageUrl} alt={selectedBlog.title} className={styles.modalImageBox} />
                  </div>
                  <div className={styles.modelContent}>
                  <p >{selectedBlog.content}</p>
                  {/* <p className={styles.ModelLikeCount}>Liked by {selectedBlog.likes.length} peoples</p> */}
                  <div className={styles.blogActions}>
                  <button className={styles.actionBtn}>
                    <FaThumbsUp /> Like ({selectedBlog.likes.length})
                  </button>
                  <button className={styles.actionBtn}>
                    <FaComment /> Comments
                  </button>
                  <button className={styles.actionBtn}>
                    <FaShareAlt /> Share
                  </button>
                </div>
                  </div>
                  
                  </div>
                  <h3>Comments:</h3>
                  <ul>
                    {selectedBlog.comments.map((comment, index) => (
                      <li key={index}>
                        <p>
                          <strong>{comment.name}:</strong> {comment.message}
                        </p>
                      </li>
                    ))}
                  </ul>
                  
                
              </div>
            ) : (
              <p>Loading blog details...</p>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default BlogFeed;
