"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Copy, Plus, Trash2, Check, CircleCheck, XCircle } from "lucide-react";
import { toast } from "sonner";

interface ApiKey {
  id: string;
  maskedKey: string;
  name: string | null;
  createdAt: Date;
  status: "ACTIVE" | "REVOKED";
  lastUsed: Date | null;
}

export default function KeysManager({ initialKeys }: { initialKeys: ApiKey[] }) {
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys);
  const [loading, setLoading] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [newGeneratedKey, setNewGeneratedKey] = useState<string | null>(null);

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setTimeout(() => {
        setNewGeneratedKey(null);
        setKeyName("");
      }, 300);
    }
  };

  const handleGenerateKey = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: keyName.trim() || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setKeys((prev) => [{
          id: data.data.id,
          maskedKey: data.data.maskedKey,
          name: data.data.name,
          createdAt: data.data.createdAt,
          status: data.data.status,
          lastUsed: null,
        }, ...prev]);
        toast.success("Secret key created successfully.");
        setNewGeneratedKey(data.data.key);
      } else {
        toast.error(data.error || "Failed to generate key");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error generating API key");
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeKey = async (id: string) => {
    try {
      await fetch(`/api/v1/keys?id=${id}`, {
        method: "DELETE",
      });
      setKeys((prev) => prev.filter((k) => k.id !== id));
      toast.success("API key revoked");
    } catch (error) {
      console.error(error);
      toast.error("Error revoking key");
    }
  };

  const handleCopy = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    toast.success("Copy vào bộ nhớ đệm thành công!");
    setTimeout(() => {
      setCopiedKeyId(null);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary text-primary-foreground shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Tạo API Key mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            {newGeneratedKey ? (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500">
                    <Check className="w-5 h-5 stroke-[3]" />
                    API Key đã được tạo!
                  </DialogTitle>
                  <DialogDescription asChild>
                    <div className="bg-amber-50 text-amber-700/90 border border-amber-200/60 p-3.5 rounded-md mt-4 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 text-[13px] leading-relaxed font-medium shadow-sm">
                      Hãy copy và lưu trữ khóa này ở nơi an toàn. Vì lý do bảo mật, bạn sẽ không thể xem lại toàn bộ khóa này sau khi đóng cửa sổ.
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={newGeneratedKey}
                      className="w-full font-mono text-sm bg-muted/30"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopy(newGeneratedKey, "new")}
                      className="shrink-0 cursor-pointer hover:bg-muted"
                    >
                      {copiedKeyId === "new" ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => handleOpenChange(false)} className="w-full cursor-pointer">
                    Đóng
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Tạo API Key mới</DialogTitle>
                  <DialogDescription>
                    Khóa bảo mật này dùng để xác thực các request của bạn đến hệ thống NexusAPI. Hãy đặt một cái tên gợi nhớ để dễ dàng quản lý phân bổ chi phí sau này.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-medium">Tên API Key<span className="text-muted-foreground font-normal"></span></label>
                    <Input
                      id="name"
                      placeholder="VD: OpenClaw, Bot Telegram,.."
                      value={keyName}
                      onChange={(e) => setKeyName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && keyName.trim() && !loading) {
                          e.preventDefault();
                          handleGenerateKey();
                        }
                      }}
                      className="w-full"
                      autoFocus
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => handleOpenChange(false)} className="cursor-pointer">
                    Hủy
                  </Button>
                  <Button
                    onClick={handleGenerateKey}
                    disabled={loading || !keyName.trim()}
                    className="cursor-pointer"
                  >
                    Tạo API Key
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-border/60 rounded-lg overflow-hidden bg-background">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="font-semibold text-xs text-muted-foreground tracking-wider">Tên</TableHead>
              <TableHead className="font-semibold text-xs text-muted-foreground tracking-wider">Trạng thái</TableHead>
              <TableHead className="font-semibold text-xs text-muted-foreground tracking-wider">API Key</TableHead>
              <TableHead className="font-semibold text-xs text-muted-foreground tracking-wider">Ngày tạo</TableHead>
              <TableHead className="font-semibold text-xs text-muted-foreground tracking-wider">Lần sử dụng cuối</TableHead>
              <TableHead className="text-right font-semibold text-xs text-muted-foreground tracking-wider">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                  Chưa có API Key nào được tạo.
                </TableCell>
              </TableRow>
            ) : (
              keys.map((k) => (
                <TableRow key={k.id} className="hover:bg-muted/20">
                  <TableCell className="font-medium">{k.name || "Untitled Key"}</TableCell>
                  <TableCell>
                    {k.status === "ACTIVE" ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                        Hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">
                        <XCircle className="w-3.5 h-3.5" /> Đã thu hồi
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{k.maskedKey}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(k.createdAt).toLocaleDateString("vi-VN", { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {k.lastUsed ? new Date(k.lastUsed).toLocaleDateString("vi-VN", { month: 'short', day: 'numeric', year: 'numeric' }) : "Chưa sử dụng"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                        onClick={() => handleRevokeKey(k.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
