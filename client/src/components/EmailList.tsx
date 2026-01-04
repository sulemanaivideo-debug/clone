import { Star, FileIcon, ImageIcon, Paperclip } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEmails, useToggleStar } from "@/hooks/use-emails";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import type { Attachment, EmailResponse } from "@shared/schema";

export function EmailList() {
  const { data: emails, isLoading, error } = useEmails();
  
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-white/5 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-white/5 rounded w-1/3" />
              <div className="h-3 bg-white/5 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Failed to load emails. Please try again.
      </div>
    );
  }

  if (!emails?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <Paperclip className="w-10 h-10 opacity-20" />
        </div>
        <p>Your inbox is empty</p>
      </div>
    );
  }

  return (
    <div className="pb-24 overflow-y-auto">
      <div className="px-4 py-2 text-[11px] font-medium text-muted-foreground tracking-wider uppercase">
        Primary
      </div>
      
      <div className="flex flex-col">
        {emails.map((email) => (
          <EmailRow key={email.id} email={email} />
        ))}
      </div>
    </div>
  );
}

function EmailRow({ email }: { email: EmailResponse }) {
  const [, setLocation] = useLocation();
  const toggleStar = useToggleStar();

  const handleRowClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking star
    if ((e.target as HTMLElement).closest('button')) return;
    setLocation(`/email/${email.id}`);
  };

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleStar.mutate({ id: email.id, isStarred: !email.isStarred });
  };

  return (
    <div 
      onClick={handleRowClick}
      className={cn(
        "group relative flex gap-5 px-5 py-4 cursor-pointer transition-colors hover:bg-white/[0.02] active:bg-white/[0.04] h-[112px]",
        email.isUnread ? "bg-white/[0.01]" : ""
      )}
    >
      <Avatar className="mt-1 h-14 w-14 border border-transparent shrink-0">
        {email.senderAvatar ? (
          <img 
            src={email.senderAvatar.startsWith('/') ? email.senderAvatar : `/${email.senderAvatar}`}
            alt={email.sender} 
            className="h-full w-full object-cover rounded-full"
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLImageElement).style.display = 'none';
              const sibling = (e.target as HTMLImageElement).nextElementSibling;
              if (sibling) (sibling as HTMLElement).style.display = 'flex';
            }}
          />
        ) : null}
        <AvatarFallback 
          className={cn(
            "text-white font-medium", 
            email.senderColor,
            email.senderAvatar ? "hidden" : "flex"
          )}
        >
          {email.senderInitial}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className={cn(
            "truncate text-[20px]",
            email.isUnread ? "font-bold text-white" : "font-medium text-white/90"
          )}>
            {email.sender}
          </h3>
          <span className={cn(
            "text-[14px] shrink-0",
            email.isUnread ? "font-bold text-white" : "text-muted-foreground"
          )}>
            {email.timeDisplay}
          </span>
        </div>

        <div className="mt-1 pr-8">
          <p className={cn(
            "truncate text-[17px] leading-tight",
            email.isUnread ? "font-bold text-white" : "font-normal text-white/80"
          )}>
            {email.subject}
          </p>
          <p className="truncate text-base text-muted-foreground mt-1 leading-tight">
            {email.snippet}
          </p>
        </div>

        {email.hasAttachments && email.attachments && (
          <div className="mt-1.5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {(email.attachments as Attachment[]).map((att, i) => (
              <div 
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-card/50 text-xs text-foreground/80 whitespace-nowrap"
              >
                {att.type === 'image' ? (
                  <ImageIcon className="w-3.5 h-3.5 text-red-400" />
                ) : (
                  <FileIcon className="w-3.5 h-3.5 text-blue-400" />
                )}
                {att.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleStarClick}
        className="absolute right-4 bottom-4 p-2 -mr-2 -mb-2 text-muted-foreground hover:text-yellow-400 focus:text-yellow-400 transition-colors"
      >
        <Star 
          className={cn(
            "w-5 h-5 transition-all", 
            email.isStarred && "fill-yellow-400 text-yellow-400"
          )} 
        />
      </button>
    </div>
  );
}
