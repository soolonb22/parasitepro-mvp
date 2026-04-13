import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import {
  BookOpen,
  Search,
  Clock,
  Tag,
  ChevronRight,
  MapPin,
  Bug,
  Droplets,
  Plane,
  Users,
  TreePine,
} from 'lucide-react'

const ARTICLES = [
  {
    slug: 'wet-season-queensland-parasites',
    title: 'Queensland Wet Season: Parasite Risks Every Household Should Know',
    excerpt:
      'With the wet season comes increased risk of soil-transmitted helminths, waterborne protozoa, and tropical skin parasites. What to watch for and when to act.',
    category: 'Queensland',
    icon: Droplets,
    readTime: '6 min',
    tags: ['Queensland', 'Wet Season', 'Prevention'],
    featured: true,
  },
  {
    slug: 'pet-worms-zoonotic-risk',
    title: 'Your Pet's Worms Could Be Your Problem Too: A Guide to Zoonotic Parasites',
    excerpt:
      'Roundworm, hookworm, and tapeworm from dogs and cats can infect humans — particularly children. What Aussie pet owners need to know.',
    category: 'Pets',
    icon: Bug,
    readTime: '7 min',
    tags: ['Pets', 'Zoonotic', 'Children'],
    featured: true,
  },
  {
    slug: 'bali-travel-gut-health',
    title: 'Bali Belly or Something Worse? Identifying Parasitic Infections After SE Asia Travel',
    excerpt:
      'Persistent post-travel gut symptoms lasting more than two weeks warrant investigation. Giardia, Entamoeba, and Strongyloides are common returnee diagnoses.',
    category: 'Travel',
    icon: Plane,
    readTime: '8 min',
    tags: ['Travel', 'SE Asia', 'Giardia'],
    featured: true,
  },
  {
    slug: 'pinworms-in-kids',
    title: 'Pinworm in Australian Kids: The Itchy Truth Parents Need to Know',
    excerpt:
      'Enterobius vermicularis affects up to 50% of school-age children at some point. Recognition, the tape test, household management, and when to see a GP.',
    category: 'Children',
    icon: Users,
    readTime: '5 min',
    tags: ['Children', 'Pinworm', 'School'],
    featured: false,
  },
  {
    slug: 'camping-bushwalking-parasites',
    title: 'Camping & Bushwalking: Parasites Lurking Off the Beaten Track',
    excerpt:
      'From Giardia in creek water to larva migrans from sandy soil, Australian outdoor enthusiasts face real parasitic risks. Prevention and treatment guide.',
    category: 'Outdoors',
    icon: TreePine,
    readTime: '6 min',
    tags: ['Outdoors', 'Camping', 'Prevention'],
    featured: false,
  },
  {
    slug: 'northern-australia-hookworm',
    title: 'Hookworm in Northern Australia: Still a Hidden Health Problem',
    excerpt:
      'Ground itch and iron deficiency anaemia in remote Indigenous communities — hookworm remains underdiagnosed. Signs, symptoms, and why footwear matters.',
    category: 'Queensland',
    icon: MapPin,
    readTime: '7 min',
    tags: ['Queensland', 'Hookworm', 'Remote Health'],
    featured: false,
  },
]

const CATEGORIES = ['All', 'Queensland', 'Travel', 'Children', 'Pets', 'Outdoors']

const categoryColors: Record<string, string> = {
  Queensland: 'bg-blue-100 text-blue-700 border-blue-200',
  Travel: 'bg-purple-100 text-purple-700 border-purple-200',
  Children: 'bg-pink-100 text-pink-700 border-pink-200',
  Pets: 'bg-orange-100 text-orange-700 border-orange-200',
  Outdoors: 'bg-green-100 text-green-700 border-green-200',
}

export default function ResearchPage() {
  const featuredArticles = ARTICLES.filter((a) => a.featured)
  const allArticles = ARTICLES

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-teal-600" />
            </div>
            <Badge className="bg-teal-100 text-teal-800 border-teal-300">Educational Library</Badge>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Research Library
          </h1>
          <p className="text-slate-500 max-w-2xl leading-relaxed mb-6">
            Evidence-based educational articles on Australian parasites, tropical diseases, prevention strategies, and when to seek medical attention. Written for everyday Australians.
          </p>

          {/* Search bar */}
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search articles… e.g. pinworm, Bali, Queensland"
              className="pl-9 border-slate-200 focus:border-teal-400"
            />
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span>Featured Articles</span>
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">Editor's Pick</Badge>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featuredArticles.map((article, i) => (
              <Card
                key={i}
                className="group border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all cursor-pointer"
              >
                <CardContent className="p-0">
                  {/* Coloured header strip */}
                  <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-t-xl px-5 py-6">
                    <article.icon className="w-7 h-7 text-teal-200 mb-3" />
                    <Badge className={`text-[10px] mb-2 ${categoryColors[article.category] || 'bg-teal-100 text-teal-700'}`}>
                      {article.category}
                    </Badge>
                    <h3 className="font-display font-semibold text-white text-base leading-snug">
                      {article.title}
                    </h3>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-sm text-slate-500 leading-relaxed mb-4">{article.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {article.readTime} read
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 text-xs px-2"
                      >
                        Read more
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All articles */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category filter */}
          <div className="flex items-center gap-2 flex-wrap mb-8">
            <span className="text-xs text-slate-400 mr-1 font-medium uppercase tracking-wide">Filter:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                  cat === 'All'
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:text-teal-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {allArticles.map((article, i) => (
              <Card
                key={i}
                className="group border-slate-200 hover:border-teal-200 hover:shadow-md transition-all cursor-pointer bg-white"
              >
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                    <article.icon className="w-5.5 h-5.5 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge className={`text-[10px] ${categoryColors[article.category] || 'bg-teal-100 text-teal-700 border-teal-200'}`}>
                        {article.category}
                      </Badge>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1 leading-snug group-hover:text-teal-700 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {article.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                          <Tag className="w-2.5 h-2.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 transition-colors shrink-0 mt-1" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* More coming */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400 mb-3">More articles being added regularly.</p>
            <Link href="/chat">
              <Button variant="outline" className="border-teal-300 text-teal-700 hover:bg-teal-50">
                Ask PARA a specific question instead
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
