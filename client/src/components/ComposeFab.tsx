import { Pencil } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEmailSchema } from "@shared/schema";
import { useCreateEmail } from "@/hooks/use-emails";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { z } from "zod";

// Create a schema that defaults some fields that user doesn't input directly
const composeSchema = insertEmailSchema.pick({
  sender: true,
  subject: true,
  snippet: true,
  // We'll auto-generate other fields in the submit handler
});

type ComposeFormData = z.infer<typeof composeSchema>;

export function ComposeFab() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createEmail = useCreateEmail();

  const form = useForm<ComposeFormData>({
    resolver: zodResolver(composeSchema),
    defaultValues: {
      sender: "Me",
      subject: "",
      snippet: "",
    },
  });

  const onSubmit = (data: ComposeFormData) => {
    // Add the missing required fields with defaults
    const fullData = {
      ...data,
      senderInitial: "M",
      senderColor: "bg-blue-500",
      timeDisplay: "Now",
      isUnread: false,
      isStarred: false,
      hasAttachments: false,
      attachments: [],
      labels: ["Sent"],
    };

    createEmail.mutate(fullData, {
      onSuccess: () => {
        toast({ title: "Email sent", duration: 2000 });
        setOpen(false);
        form.reset();
      },
      onError: (err) => {
        toast({ 
          title: "Error sending email", 
          description: err.message, 
          variant: "destructive" 
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button 
          className="fixed bottom-6 right-6 h-14 w-14 sm:w-auto sm:h-12 sm:px-6 sm:rounded-2xl rounded-[1.25rem] bg-card text-primary shadow-lg shadow-black/40 hover:shadow-xl hover:bg-card/90 hover:brightness-110 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 z-40 group"
          aria-label="Compose email"
        >
          <Pencil className="w-6 h-6" />
          <span className="hidden sm:inline font-semibold text-base">Compose</span>
        </button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border sm:max-w-xl text-foreground">
        <DialogHeader>
          <DialogTitle>Compose</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <input
              {...form.register("sender")}
              placeholder="To"
              className="w-full bg-transparent border-b border-border py-2 px-1 outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-2">
            <input
              {...form.register("subject")}
              placeholder="Subject"
              className="w-full bg-transparent border-b border-border py-2 px-1 outline-none focus:border-primary transition-colors placeholder:text-muted-foreground font-medium"
            />
          </div>
          <div className="space-y-2">
            <textarea
              {...form.register("snippet")}
              placeholder="Compose email"
              rows={8}
              className="w-full bg-transparent border-none py-2 px-1 outline-none resize-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={createEmail.isPending}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {createEmail.isPending ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
