import { Card, CardContent } from '@/components/ui/card';
import { Marquee } from '@/components/ui/3d-testimonails';

// Testimonial data for Start Drive BVL — real names & real messages.
// Avatars are generated monogram badges (no external/randomuser dependency).
const testimonials = [
  {
    name: 'Alexandru Popa',
    initial: 'A',
    body: 'Am avut o experiență excelentă! Instructorii sunt calmi și profesioniști.',
    source: 'Google',
    color: 'from-red-500 to-rose-600',
  },
  {
    name: 'Maria Ionescu',
    initial: 'M',
    body: 'Cea mai bună școală auto din Suceava! Am luat permisul din prima.',
    source: 'Google',
    color: 'from-rose-500 to-pink-600',
  },
  {
    name: 'Cristian D.',
    initial: 'C',
    body: 'Profesionalism la superlativ. Recomand cu mare încredere!',
    source: 'Google',
    color: 'from-orange-500 to-red-600',
  },
  {
    name: 'Elena R.',
    initial: 'E',
    body: 'Instructorii sunt răbdători, mașinile noi și curate. Am promovat din prima!',
    source: 'Facebook',
    color: 'from-red-600 to-red-800',
  },
  {
    name: 'Andrei M.',
    initial: 'A',
    body: 'Plata în rate și program flexibil — exact ce aveam nevoie!',
    source: 'Google',
    color: 'from-rose-600 to-red-700',
  },
  {
    name: 'Diana V.',
    initial: 'D',
    body: 'Am ales Start Drive la recomandarea unei prietene și nu am regretat.',
    source: 'Google',
    color: 'from-pink-500 to-rose-600',
  },
  {
    name: 'Mihai T.',
    initial: 'M',
    body: 'Pregătirea pentru traseu a fost excelentă. Am trecut fără emoții!',
    source: 'Google',
    color: 'from-red-500 to-orange-600',
  },
  {
    name: 'Ioana P.',
    initial: 'I',
    body: 'Mulțumesc echipei pentru răbdare și profesionalism!',
    source: 'Facebook',
    color: 'from-rose-500 to-red-600',
  },
  {
    name: 'Radu S.',
    initial: 'R',
    body: 'Școala perfectă pentru categoriile C și CE. Instructori cu experiență!',
    source: 'Google',
    color: 'from-red-600 to-rose-700',
  },
];

function Monogram({ initial, color }: { initial: string; color: string }) {
  return (
    <div
      className={`flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${color} text-white font-bold text-sm shadow-md ring-2 ring-white/10`}
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}

function TestimonialCard({ initial, name, body, source, color }: (typeof testimonials)[number]) {
  return (
    <Card className="w-[280px] bg-[#16161a] border border-white/5 hover:border-[#cc0000]/40 hover:-translate-y-1 transition-all duration-300 shrink-0 shadow-lg">
      <CardContent className="p-5">
        <div className="flex items-center gap-2.5">
          <Monogram initial={initial} color={color} />
          <div className="flex flex-col">
            <figcaption className="text-sm font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {name}
            </figcaption>
            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <span className="text-amber-400">★</span> {source}
            </p>
          </div>
        </div>
        <blockquote className="mt-3 text-sm text-slate-300 leading-relaxed font-light italic">
          &ldquo;{body}&rdquo;
        </blockquote>
      </CardContent>
    </Card>
  );
}

export default function Testimonials3D() {
  return (
    <div className="border border-white/10 rounded-2xl relative flex h-[520px] w-full max-w-[850px] flex-row items-center justify-center overflow-hidden gap-4 [perspective:1000px] bg-[#161616]/50 backdrop-blur-sm shadow-2xl">
      <div
        className="flex flex-row items-center gap-4"
        style={{
          transform:
            'translateX(-60px) translateY(0px) translateZ(-50px) rotateX(20deg) rotateY(-10deg) rotateZ(10deg)',
        }}
      >
        {/* Vertical Marquee (downwards) */}
        <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
          {testimonials.map((review, i) => (
            <TestimonialCard key={`${review.name}-${i}`} {...review} />
          ))}
        </Marquee>
        {/* Vertical Marquee (upwards) */}
        <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
          {testimonials.map((review, i) => (
            <TestimonialCard key={`${review.name}-${i}-r`} {...review} />
          ))}
        </Marquee>
        {/* Vertical Marquee (downwards) */}
        <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
          {testimonials.map((review, i) => (
            <TestimonialCard key={`${review.name}-${i}-b`} {...review} />
          ))}
        </Marquee>
        {/* Vertical Marquee (upwards) */}
        <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
          {testimonials.map((review, i) => (
            <TestimonialCard key={`${review.name}-${i}-br`} {...review} />
          ))}
        </Marquee>

        {/* Gradient overlays — fade to the section background (#0a0a0b) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-[#0a0a0b] to-transparent"></div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#0a0a0b] to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#0a0a0b] to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#0a0a0b] to-transparent"></div>
      </div>
    </div>
  );
}
