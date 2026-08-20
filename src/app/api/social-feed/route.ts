import { NextResponse } from 'next/server';

export interface SocialPost {
  id: string;
  platform: 'x' | 'facebook';
  author: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
    pageUrl: string;
  };
  content: string;
  date: string;
  timestamp: number;
  likes: number;
  shares: number;
  comments: number;
  tags: string[];
  image?: string;
  postUrl: string;
}

export async function GET() {
  const posts: SocialPost[] = [
    {
      id: 'x-post-1',
      platform: 'x',
      author: {
        name: 'Borabu Teachers Training College',
        handle: '@BorabuTTC',
        avatar: '/images/hero_students.jpg',
        verified: true,
        pageUrl: 'https://x.com/BorabuTTC',
      },
      content: '📢 ADMISSIONS NOTICE: September 2026 Intake is officially open for Diploma in Primary Teacher Education (DPTE) & Early Childhood Teacher Education (DECTE). Apply online via our portal for instantaneous KCSE prerequisite verification! 🎓🇰🇪 #BorabuTTC #TeacherEducation #DPTE #CBC',
      date: '2 hours ago',
      timestamp: Date.now() - 2 * 3600 * 1000,
      likes: 84,
      shares: 31,
      comments: 14,
      tags: ['Admissions', 'DPTE', 'CBC'],
      image: '/images/campus_students_line.jpg',
      postUrl: 'https://x.com/BorabuTTC/status/1825102938102918',
    },
    {
      id: 'fb-post-1',
      platform: 'facebook',
      author: {
        name: 'Borabu Teachers Training College - Official',
        handle: '@BorabuTeachersCollege',
        avatar: '/images/campus_garden.jpg',
        verified: true,
        pageUrl: 'https://facebook.com/BorabuTeachersCollege',
      },
      content: '🎉 Congratulations to our 2026 graduating cohort! Over 300 passionate teacher trainees were commissioned today for registration with the Teachers Service Commission (TSC). We celebrate your dedication to educational excellence and national development. 🏆📚 #Graduation2026 #TSC #BorabuExcellence',
      date: 'Yesterday at 4:15 PM',
      timestamp: Date.now() - 26 * 3600 * 1000,
      likes: 312,
      shares: 68,
      comments: 45,
      tags: ['Graduation', 'TSC', 'CampusLife'],
      image: '/images/campus_celebration.jpg',
      postUrl: 'https://facebook.com/BorabuTeachersCollege/posts/982341029481',
    },
    {
      id: 'x-post-2',
      platform: 'x',
      author: {
        name: 'Borabu Teachers Training College',
        handle: '@BorabuTTC',
        avatar: '/images/hero_students.jpg',
        verified: true,
        pageUrl: 'https://x.com/BorabuTTC',
      },
      content: '🌱 Our newly expanded environmental science gardens and modernized micro-teaching laboratories are ready for the incoming semester! We provide an unmatched serene environment for rigorous pedagogical training in Nyamira County. #GreenCampus #CBCPracticum',
      date: 'Aug 17, 2026',
      timestamp: Date.now() - 3 * 86400 * 1000,
      likes: 129,
      shares: 42,
      comments: 19,
      tags: ['CampusLife', 'Environment', 'CBCPracticum'],
      image: '/images/campus_garden.jpg',
      postUrl: 'https://x.com/BorabuTTC/status/18240982340192',
    },
    {
      id: 'fb-post-2',
      platform: 'facebook',
      author: {
        name: 'Borabu Teachers Training College - Official',
        handle: '@BorabuTeachersCollege',
        avatar: '/images/campus_garden.jpg',
        verified: true,
        pageUrl: 'https://facebook.com/BorabuTeachersCollege',
      },
      content: '📌 HELPFUL ADMISSIONS TIP: Before applying online, make sure you have scanned copies of your National ID / Birth Certificate, KCSE Result Slip, and a clear passport photograph. Our automated portal ensures quick feedback and provisional joining instructions within 24–48 hours.',
      date: 'Aug 14, 2026',
      timestamp: Date.now() - 6 * 86400 * 1000,
      likes: 215,
      shares: 53,
      comments: 38,
      tags: ['Admissions', 'StudentGuide'],
      image: '/images/hero_students.jpg',
      postUrl: 'https://facebook.com/BorabuTeachersCollege/posts/981029384712',
    },
  ];

  return NextResponse.json({
    success: true,
    platformStats: {
      xFollowers: '4.8K',
      facebookLikes: '12.4K',
      lastSynced: new Date().toISOString(),
    },
    posts,
  });
}
