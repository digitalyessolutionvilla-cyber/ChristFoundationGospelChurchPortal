import { ClipboardPenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface RegistrationDialogProps {
    className?: string;
    label?: string;
}

const REGISTRATION_URL = 'https://form.svhrt.com/6aaf8c0e5f15ef5ec31e3687';

export function RegistrationDialog({ className = '', label = 'Register Now' }: RegistrationDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className={`gap-2 bg-church-red text-white hover:bg-church-red/90 font-serif ${className}`}>
                    <ClipboardPenLine className="h-4 w-4" />
                    {label}
                </Button>
            </DialogTrigger>
            <DialogContent className="flex h-[92vh] max-w-4xl flex-col gap-0 overflow-hidden p-0">
                <DialogHeader className="shrink-0 border-b border-border px-5 py-2">
                    <DialogTitle className="font-display text-xl text-primary">National Youth Rally Registration</DialogTitle>
                </DialogHeader>
                <iframe
                    title="National Youth Rally registration form"
                    src={REGISTRATION_URL}
                    className="h-full min-h-0 w-full flex-1 border-0"
                    loading="lazy"
                />
            </DialogContent>
        </Dialog>
    );
}
