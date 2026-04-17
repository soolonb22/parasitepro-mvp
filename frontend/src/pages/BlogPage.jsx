import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const BLOG_POSTS = [
  {
    id: 1,
    slug: 'understanding-parasitic-infections',
    title: 'Understanding Parasitic Infections: A Comprehensive Guide',
    excerpt: 'Learn about the most common parasitic infections worldwide, their symptoms, transmission methods, and natural prevention strategies.',
    category: 'Education',
    author: 'Dr. Health Team',
    publishedAt: '2024-12-01',
    readTime: '8 min read',
    tags: ['parasites', 'health', 'prevention'],
    content: `
      <h2>What Are Parasitic Infections?</h2>
      <p>Parasitic infections occur when parasites—organisms that live on or inside a host and get their food at the expense of the host—invade the human body. These can range from microscopic protozoa to visible worms and arthropods.</p>
      
      <h2>Common Types of Parasites</h2>
      <h3>Protozoa</h3>
      <p>Single-celled organisms that can multiply within the human body. Examples include Giardia lamblia and Cryptosporidium.</p>
      
      <h3>Helminths</h3>
      <p>Multicellular organisms including roundworms, tapeworms, and flukes that can live in the intestines or other tissues.</p>
      
      <h3>Ectoparasites</h3>
      <p>Organisms that live on the skin surface, such as lice, mites, and ticks.</p>
      
      <h2>Natural Prevention Strategies</h2>
      <ul>
        <li>Wash hands thoroughly before eating and after using the bathroom</li>
        <li>Cook meat to safe temperatures</li>
        <li>Drink clean, filtered water</li>
        <li>Wash fruits and vegetables thoroughly</li>
        <li>Practice good hygiene with pets</li>
      </ul>
      
      <h2>When to Seek Help</h2>
      <p>If you experience persistent digestive issues, unexplained fatigue, skin rashes, or have traveled to high-risk areas, consider getting a professional health analysis.</p>
    `
  },
  {
    id: 2,
    slug: 'natural-remedies-parasites',
    title: 'Natural Remedies for Parasitic Infections: Evidence-Based Approaches',
    excerpt: 'Discover natural and holistic approaches to supporting your body during parasitic infections, including herbs, diet, and lifestyle changes.',
    category: 'Natural Health',
    author: 'Wellness Team',
    publishedAt: '2024-11-28',
    readTime: '10 min read',
    tags: ['natural remedies', 'herbs', 'holistic health'],
    content: `
      <h2>The Holistic Approach</h2>
      <p>Natural remedies can complement conventional treatments and support your body's natural defense mechanisms against parasites.</p>
      
      <h2>Powerful Anti-Parasitic Foods</h2>
      <h3>Garlic</h3>
      <p>Contains allicin, which has demonstrated anti-parasitic properties in various studies.</p>
      
      <h3>Pumpkin Seeds</h3>
      <p>Rich in cucurbitins, compounds that may help expel intestinal parasites.</p>
      
      <h3>Papaya Seeds</h3>
      <p>Traditional remedy containing proteolytic enzymes that may affect parasite metabolism.</p>
      
      <h2>Herbal Protocols</h2>
      <ul>
        <li><strong>Wormwood (Artemisia absinthium)</strong> - Traditional anti-parasitic herb</li>
        <li><strong>Black Walnut Hull</strong> - Contains juglone, a natural anti-parasitic compound</li>
        <li><strong>Cloves</strong> - May help eliminate parasite eggs</li>
        <li><strong>Oregano Oil</strong> - Powerful antimicrobial properties</li>
      </ul>
      
      <h2>Dietary Recommendations</h2>
      <p>Focus on a diet low in sugar and refined carbohydrates, as these can feed parasites. Include plenty of fiber, fermented foods, and anti-inflammatory ingredients.</p>
    `
  },
  {
    id: 3,
    slug: 'travel-health-parasites',
    title: 'Travel Health: Protecting Yourself from Parasites Abroad',
    excerpt: 'Essential tips for travelers to prevent parasitic infections while exploring high-risk regions around the world.',
    category: 'Travel Health',
    author: 'Travel Health Team',
    publishedAt: '2024-11-25',
    readTime: '7 min read',
    tags: ['travel', 'prevention', 'global health'],
    content: `
      <h2>Pre-Travel Preparation</h2>
      <p>Before traveling to regions with higher parasite risk, take time to prepare your health toolkit and understand local risks.</p>
      
      <h2>High-Risk Regions</h2>
      <ul>
        <li><strong>Sub-Saharan Africa</strong> - Malaria, schistosomiasis, soil-transmitted helminths</li>
        <li><strong>South Asia</strong> - Giardia, cryptosporidium, hookworm</li>
        <li><strong>Central/South America</strong> - Chagas disease, leishmaniasis, tapeworms</li>
        <li><strong>Southeast Asia</strong> - Liver flukes, strongyloides</li>
      </ul>
      
      <h2>Essential Prevention Tips</h2>
      <ol>
        <li><strong>Water Safety</strong> - Drink only bottled or purified water</li>
        <li><strong>Food Precautions</strong> - Eat well-cooked foods, avoid street food</li>
        <li><strong>Insect Protection</strong> - Use repellent and sleep under nets</li>
        <li><strong>Footwear</strong> - Always wear shoes to prevent soil-transmitted infections</li>
        <li><strong>Swimming</strong> - Avoid freshwater swimming in endemic areas</li>
      </ol>
      
      <h2>Post-Travel Monitoring</h2>
      <p>After returning from high-risk areas, monitor your health for any unusual symptoms and consider screening if you experience digestive issues or unexplained fatigue.</p>
    `
  },
  {
    id: 4,
    slug: 'gut-health-parasites',
    title: 'Gut Health and Parasites: Understanding the Connection',
    excerpt: 'Explore the relationship between gut microbiome health and susceptibility to parasitic infections.',
    category: 'Gut Health',
    author: 'Microbiome Research Team',
    publishedAt: '2024-11-20',
    readTime: '9 min read',
    tags: ['gut health', 'microbiome', 'immunity'],
    content: `
      <h2>The Gut-Parasite Connection</h2>
      <p>Your gut microbiome plays a crucial role in defending against parasitic infections. A healthy, diverse microbiome can help prevent parasites from establishing themselves.</p>
      
      <h2>How Parasites Affect Gut Health</h2>
      <ul>
        <li>Disruption of beneficial bacteria populations</li>
        <li>Damage to intestinal lining</li>
        <li>Nutrient malabsorption</li>
        <li>Chronic inflammation</li>
        <li>Immune system dysregulation</li>
      </ul>
      
      <h2>Rebuilding Gut Health</h2>
      <h3>Probiotics</h3>
      <p>Beneficial bacteria that can help restore balance after parasitic infections.</p>
      
      <h3>Prebiotics</h3>
      <p>Fiber-rich foods that feed beneficial gut bacteria.</p>
      
      <h3>Fermented Foods</h3>
      <p>Kimchi, sauerkraut, kefir, and kombucha can help repopulate the gut with beneficial microorganisms.</p>
      
      <h2>Supporting Immune Function</h2>
      <p>A healthy gut is essential for proper immune function. Focus on reducing inflammation, managing stress, and getting adequate sleep to support your body's natural defenses.</p>
    `
  }
];

const BlogPage = () => {
    const { slug } = useParams();
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', ...new Set(BLOG_POSTS.map(p => p.category))];
  
  const filteredPosts = selectedCategory === 'All' 
    ? BLOG_POSTS 
    : BLOG_POSTS.filter(p => p.category === selectedCategory);
  
  if (slug) {
    const post = BLOG_POSTS.find(p => p.slug === slug);
    
    if (!post) {
      return (
        <>
          <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
            <h1>Article Not Found</h1>
            <Link to="/blog" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Back to Blog
            </Link>
          </div>
        </>
      );
    }
    
    return (
      <>
        <Helmet>
          <title>{post.title} | Parasite Identification Pro</title>
          <meta name="description" content={post.excerpt} />
          <meta property="og:title" content={post.title} />
          <meta property="og:description" content={post.excerpt} />
          <meta property="og:type" content="article" />
          <meta name="keywords" content={post.tags.join(', ')} />
        </Helmet>
        
        <Navbar />
        
        <article className="blog-article">
          <div className="container" style={{ maxWidth: '800px', padding: '2rem 1rem' }}>
            <Link to="/blog" className="blog-back-link">
              ← Back to Blog
            </Link>
            
            <header className="blog-article-header">
              <span className="blog-category-badge">{post.category}</span>
              <h1 className="blog-article-title">{post.title}</h1>
              <div className="blog-article-meta">
                <span>{post.author}</span>
                <span>•</span>
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </header>
            
            <div 
              className="blog-article-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            <div className="blog-article-tags">
              {post.tags.map(tag => (
                <span key={tag} className="blog-tag">#{tag}</span>
              ))}
            </div>
            
            <div className="blog-share-section">
              <h4>Share this article</h4>
              <SocialShareButtons 
                url={`${window.location.origin}/blog/${post.slug}`}
                title={post.title}
                description={post.excerpt}
                hashtags={post.tags}
              />
            </div>
            
            <div className="blog-cta">
              <h3>Ready to Get Started?</h3>
              <p>Upload a health image for AI-powered analysis and personalized recommendations.</p>
              <Link to="/signup" className="btn btn-primary">
                Try Free Analysis
              </Link>
            </div>
          </div>
        </article>
      </>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Health Resources & Blog | Parasite Identification Pro</title>
        <meta name="description" content="Expert articles on parasitic infections, natural remedies, travel health, and gut wellness. Stay informed with our comprehensive health resource hub." />
      </Helmet>
      
      <Navbar />
      
      <div className="blog-page">
        <div className="container">
          <header className="blog-header">
            <h1>Health Resources & Blog</h1>
            <p>Expert insights on parasitic infections, natural remedies, and global health</p>
          </header>
          
          <div className="blog-categories">
            {categories.map(cat => (
              <button
                key={cat}
                className={`blog-category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="blog-grid">
            {filteredPosts.map(post => (
              <article key={post.id} className="blog-card">
                <div className="blog-card-content">
                  <span className="blog-category-badge">{post.category}</span>
                  <h2 className="blog-card-title">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                  <div className="blog-card-meta">
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <Link to={`/blog/${post.slug}`} className="blog-read-more">
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
          
          <div className="blog-newsletter">
            <h3>Stay Informed</h3>
            <p>Get the latest health insights delivered to your inbox</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" className="newsletter-input" />
              <button className="btn btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPage;
