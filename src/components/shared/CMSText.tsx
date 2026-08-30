import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface CMSTextProps {
  contentKey: string;
  className?: string;
  /** If true, renders each paragraph as a <p> element */
  multiParagraph?: boolean;
}

const DEFAULT_CMS_TEXT: Record<string, string> = {
  welcome_message: 'Welcome to Christ Foundation Gospel Church (CFGC). We are a Spirit-filled, Word-based church committed to raising believers who are grounded in the Word of God and empowered by the Holy Spirit. Our mission is to preach Christ as the Sure Foundation for victorious Christian living.\n\nWe believe in the saving grace of Jesus Christ, the power of the Holy Spirit, and the authority of the Word of God. Our doors are open to all who seek a personal relationship with God.\n\nWe invite you to join us for worship, fellowship, and spiritual growth. Whether you are a long-time believer or just beginning your faith journey, there is a place for you at CFGC.',
  history_text: 'Christ Foundation Gospel Church (CFGC) was founded in 1969 by the late Bishop S. A. Akintobi as a Spirit-filled, Word-based Pentecostal church. From its humble beginnings in Lagos, Nigeria, the church has grown to become a nationwide ministry with branches across Nigeria and beyond.\n\nThe church is built on the bedrock of Scripture, with a strong emphasis on evangelism, discipleship, and community service. Over the decades, CFGC has been instrumental in transforming lives through the preaching of the Gospel and practical Christian service.\n\nToday, under the leadership of Rev. Nathaniel A. Akintobi, the church continues to grow in strength and influence, fulfilling its mandate of preaching Christ as the Sure Foundation for victorious Christian living.',
  vision_text: 'To raise a generation of Spirit-filled, Word-grounded believers who will demonstrate the Kingdom of God in every sphere of life — in their homes, communities, workplaces, and nations.',
  mission_text: 'To preach Christ as the Sure Foundation for victorious Christian living, making disciples of all nations through evangelism, discipleship, worship, fellowship, and service.',
  motto_text: 'Christ, the Sure Foundation — 1 Corinthians 3:11',
  doctrines_text: '**The Holy Scripture**\nWe believe the Bible is the inspired and infallible Word of God, the supreme authority in all matters of faith and conduct.\n\n**The Trinity**\nWe believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit.\n\n**Salvation**\nWe believe that all have sinned and that salvation is by grace through faith in Jesus Christ alone, through repentance and confession.\n\n**The Holy Spirit**\nWe believe in the baptism of the Holy Spirit with the evidence of speaking in tongues, as the promise of the Father for empowerment for service.\n\n**Water Baptism**\nWe believe in water baptism by immersion as an outward declaration of faith in Christ.\n\n**The Church**\nWe believe in the universal Church, the Body of Christ, of which all true believers are members, and in the importance of regular fellowship.\n\n**The Second Coming of Christ**\nWe believe in the personal, visible, and imminent return of the Lord Jesus Christ to reign in glory.',
  youth_ministry_text: 'The CFGC Youth Ministry is dedicated to raising a generation of young people who are rooted in God\'s Word, empowered by the Holy Spirit, and equipped to make a difference in their world. We provide a dynamic, fun, and faith-filled environment where young people can encounter God, build meaningful friendships, and discover their purpose.\n\nThrough weekly fellowships, Bible studies, prayer meetings, and outreach activities, our youth are challenged to grow in their relationship with God and to be salt and light in their communities. We believe that young people are not just the church of tomorrow — they are the church of today.',
};

export function CMSText({ contentKey, className = '', multiParagraph = true }: CMSTextProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['cms_content', contentKey],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('cms_content')
          .select('value')
          .eq('key', contentKey)
          .maybeSingle();

        if (error) {
          return DEFAULT_CMS_TEXT[contentKey] ?? '';
        }

        return data?.value ?? DEFAULT_CMS_TEXT[contentKey] ?? '';
      } catch {
        return DEFAULT_CMS_TEXT[contentKey] ?? '';
      }
    },
  });

  if (isLoading) {
    return (
      <div className={`space-y-2 ${className}`}>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    );
  }

  if (!multiParagraph) {
    return <span className={className}>{data}</span>;
  }

  const paragraphs = (data ?? '').split('\n\n').filter(Boolean);

  return (
    <div className={`space-y-4 ${className}`}>
      {paragraphs.map((para, i) => {
        // Detect bold markdown **text**
        const parts = para.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="leading-relaxed">
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j}>{part.slice(2, -2)}</strong>;
              }
              return <span key={j}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}
