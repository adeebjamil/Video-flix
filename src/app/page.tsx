"use client";
import LoginButton from "@/components/LoginButton";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#141414] overflow-hidden">
      {/* Hero Background with Netflix-style gradient */}
      <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent"></div>
      </div>

      <div className="relative h-screen flex flex-col items-center justify-center px-6">
        <div className="max-w-4xl w-full transform hover:scale-105 transition-all duration-300">
          {/* App Title */}
          <h1 className="text-6xl md:text-7xl font-bold mb-4 text-white text-center">
            <span className="text-[#E50914]">🎥</span> VideoFlix
          </h1>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            {[
              { title: 'Upload Instantly', icon: '📤', desc: 'Share your content in seconds' },
              { title: 'Watch Anywhere', icon: '🌐', desc: 'Stream on any device' },
              { title: 'Create & Share', icon: '⚡', desc: 'Build your audience' },
            ].map((feature, i) => (
              <div key={i} 
                className="group p-6 rounded-lg bg-[#181818] hover:bg-[#282828] transition-all duration-300 
                transform hover:scale-105 cursor-pointer border border-gray-800">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-6">
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
              Ready to create? Enter a world of unlimited video sharing.
            </p>
            
            {/* Netflix-style Button */}
            <div className="inline-block">
              <LoginButton />
            </div>
          </div>
        </div>

        {/* Netflix-style Footer Wave */}
        <div className="absolute bottom-0 w-full overflow-hidden">
          <div className="h-[100px] bg-gradient-to-t from-[#E50914]/10 to-transparent"></div>
        </div>
      </div>
    </div>
  );
}