import { ExternalLink, Mail, MessageSquare, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { customerById, productById, sourceById } from "@/data/feedback";
import { channelLabels } from "@/lib/analytics";
import type { Channel, FeedbackItem } from "@/lib/types";

export const channelIcon: Record<Channel, typeof Mail> = {
  ticket: Ticket,
  email: Mail,
  slack: MessageSquare,
};

export function CitationDrawer({
  item,
  onOpenChange,
}: {
  item: FeedbackItem | null;
  onOpenChange: (open: boolean) => void;
}) {
  const sources = item ? item.sourceIds.map((id) => sourceById.get(id)!).filter(Boolean) : [];

  return (
    <Sheet open={!!item} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        {item && (
          <>
            <SheetHeader className="text-left">
              <SheetTitle className="font-display">{item.theme}</SheetTitle>
              <SheetDescription>
                {customerById.get(item.customerId)?.name} ·{" "}
                {productById.get(item.productId)?.name} · {item.category}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-5 px-4 pb-8">
              <div className="rounded-lg border bg-surface/60 p-4">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Synthesized description
                </p>
                <p className="mt-2 text-sm leading-relaxed">{item.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline">Churn risk: {item.churnRisk}</Badge>
                  <Badge variant="outline">Confidence: {item.confidence}</Badge>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Citations ({sources.length})
                </p>
                <div className="mt-3 space-y-3">
                  {sources.map((source) => {
                    const Icon = channelIcon[source.channel];
                    return (
                      <article key={source.id} className="rounded-lg border bg-card p-4 shadow-card">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Icon className="h-4 w-4 text-primary" />
                            {channelLabels[source.channel]}
                            <span className="text-muted-foreground">· {source.location}</span>
                          </div>
                          <Button asChild variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                            <a href={source.permalink} target="_blank" rel="noreferrer">
                              Open <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                        <p className="mt-2 text-sm font-semibold">{source.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {source.author} · {source.authorRole} ·{" "}
                          {new Date(source.timestamp).toLocaleString()}
                        </p>
                        <p className="mt-3 text-sm whitespace-pre-line text-foreground/90">
                          {source.body}
                        </p>
                        {source.body.includes(item.excerpt) && (
                          <p className="mt-3 border-l-2 border-primary pl-3 text-xs text-muted-foreground italic">
                            Excerpt used in synthesis: “{item.excerpt}”
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
