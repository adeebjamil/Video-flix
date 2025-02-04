interface VideoCardProps {
    title: string;
    url: string;
  }
  
  export default function VideoCard({ title, url }: VideoCardProps) {
    return (
      <div className="border p-4 rounded-md shadow-md">
        <video className="w-full h-auto" controls>
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <h3 className="mt-2 text-lg font-bold">{title}</h3>
      </div>
    );
  }
  