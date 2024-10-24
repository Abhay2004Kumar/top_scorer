import React, { useState, useEffect, useRef } from 'react';
import { FaThumbsUp, FaComment, FaShareAlt } from 'react-icons/fa';
import styles from '../Blog_Page/Blog.module.css'; // Ensure correct path to CSS module
import Loading from '../../Components/Loading/Loading';

const BlogFeed = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  useEffect(() => {
    fetchBlogs(); // Initial fetch on component mount
  }, []);

  // Function to simulate fetching data from the backend
  const fetchBlogs = () => {
    if (loading) return; // Prevent multiple fetches at once
    setLoading(true);

    setTimeout(() => {
      const newBlogs = [
        // Sample blog data for testing
        {
          id: blogs.length + 1,
          title: 'IT Beats CSE to get into finals, Lots of Mistake by CSE to Note {IIIT Una}',
          content: 'In a thrilling match held on the 23rd of September, the IT team outperformed expectations by beating the CSE team. This victory comes after a series of intense training sessions and strategic game plans. Despite a few mistakes on the part of CSE, the match was a testament to the competitive spirit at IIIT Una.',
          author: 'Prasoon Kushwaha',
          date: 'Monday 23, Sept 2024',
          imageUrl: 'https://images.pexels.com/photos/3800517/pexels-photo-3800517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Random image URL
        },
        {
          id: blogs.length + 1,
          title: 'CSE Won Kho-Kho Finals! Thanks to Sanket',
          content: 'The Kho-Kho finals saw an incredible performance from the CSE team, led by the strategic genius of Sanket. His leadership on the field and tactical decisions played a pivotal role in securing the championship. The final score was 15-10, showcasing a well-fought battle that kept everyone on the edge of their seats.',
          author: 'Ankur Yadav CSE',
          date: 'Tuesday 24, Oct 2024',
          imageUrl: 'https://thedailyguardian.com/wp-content/uploads/2021/02/83123313_1704_P_5_mr.jpg', // Random image URL
        },
        {
          id: blogs.length + 1,
          title: 'Battle of Brains, CSE Won Chess in Yalgaar 2024',
          content: 'At Yalgaar 2024, the CSE team showcased their strategic prowess by clinching victory in the chess tournament. With a series of brilliant moves and deep thinking, the team demonstrated that they were not just programmers but also exceptional strategists. The excitement in the air was palpable as they claimed the trophy amidst cheers from their fellow students.',
          author: 'John Smith',
          date: 'Wednesday 25, Sept 2024',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Chess_pieces_close_up.jpg/800px-Chess_pieces_close_up.jpg', // Random image URL
        },
        {
          id: blogs.length + 1,
          title: 'The Thrill of the Run: CSE Marathon Highlights',
          content: 'The CSE Marathon held on the campus attracted participants from various departments, all vying for the title. With a record number of participants this year, the event showcased not only athleticism but also community spirit. The finish line was a sea of excitement as the first runners crossed, celebrating their hard work and dedication.',
          author: 'Neha Sharma',
          date: 'Saturday 1, Oct 2024',
          imageUrl: 'https://cdn.prod.website-files.com/5f58a4616a9e71d63ca059c8/63eb9c9bc0c7e518fd04ee67_MG1_2798.webp', // Random image URL
        },
        {
          id: blogs.length + 1,
          title: 'Basketball Championship: A Match for the Ages',
          content: 'In an exhilarating championship game, the IIIT Una basketball team faced off against their long-time rivals. With nail-biting moments and spectacular plays, the game kept fans on the edge of their seats. Ultimately, the home team secured a hard-fought victory, earning the championship trophy amidst roaring cheers.',
          author: 'Ravi Verma',
          date: 'Sunday 2, Oct 2024',
          imageUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?cs=srgb&dl=pexels-markusspiske-1752757.jpg&fm=jpg', // Random image URL
        },
        {
          id: blogs.length + 1,
          title: 'Table Tennis Tournament: Skill and Precision on Display',
          content: 'The annual Table Tennis Tournament was a showcase of skill and precision, with competitors battling it out in thrilling matches. The finals were particularly exciting, featuring an intense showdown between last year’s champion and an up-and-coming player. In the end, it was a nail-biter, with the crowd cheering for every point.',
          author: 'Sonia Gupta',
          date: 'Monday 3, Oct 2024',
          imageUrl: 'https://media.self.com/photos/5c360cc973e3cb2ca1e0fd35/4:3/w_2560%2Cc_limit/table-tennis.jpg', // Random image URL
        },
        {
          id: blogs.length + 1,
          title: 'Football Finals: CSE Triumphs Against IT',
          content: 'The football finals this year were nothing short of spectacular. The CSE team showed exceptional teamwork and skill, overcoming a strong IT team to claim the championship title. The match ended with a score of 3-1, and the players celebrated their hard work and dedication with their supporters.',
          author: 'Mohit Saini',
          date: 'Tuesday 4, Oct 2024',
          imageUrl: 'https://cdn.firstcry.com/education/2022/06/10173546/Essay-on-Football.jpg', // Random image URL
        },
        {
          id: blogs.length + 1,
          title: 'Ultimate Frisbee Tournament: A New Champion Emerges',
          content: 'The Ultimate Frisbee tournament concluded with a thrilling final that saw a new champion emerge. With dynamic plays and incredible teamwork, the underdogs claimed victory over the seasoned champions in a match that will be remembered for years to come. The tournament fostered a spirit of camaraderie and sportsmanship.',
          author: 'Anjali Mehta',
          date: 'Wednesday 5, Oct 2024',
          imageUrl: 'https://www.kidzherald.com/wp-content/uploads/2024/01/F-4.webp', // Random image URL
        }
      ];

      setBlogs(prevBlogs => [...prevBlogs, ...newBlogs]);
      setLoading(false);
    }, 2000);
  };

  // Intersection Observer to detect when to load more blogs
  const lastBlogElementRef = useRef();
  useEffect(() => {
    if (loading) return;

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };

    const callback = (entries) => {
      if (entries[0].isIntersecting) {
        fetchBlogs(); // Fetch more blogs when the last blog is visible
      }
    };

    observer.current = new IntersectionObserver(callback, options);
    if (lastBlogElementRef.current) {
      observer.current.observe(lastBlogElementRef.current);
    }

    return () => {
      if (observer.current && lastBlogElementRef.current) {
        observer.current.unobserve(lastBlogElementRef.current);
      }
    };
  }, [loading]);

  return (
    <div className={styles.blogFeedContainer}>
      <div className={styles.blogFeed}>
        {blogs.length === 0 && loading ? (  // Show loading animation if no blogs yet and loading
          <Loading />
        ) : (
          blogs.map((blog, index) => (
            <div
              key={blog.id}
              className={styles.blogPost}
              ref={index === blogs.length - 1 ? lastBlogElementRef : null} // Reference the last blog post
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
          ))
        )}
        {loading && <Loading />} {/* Show loading animation while fetching more blogs */}
      </div>
    </div>
  );
};

export default BlogFeed;
