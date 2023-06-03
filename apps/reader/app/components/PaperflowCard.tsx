import { Card, CardContent } from "app/components/Card";

export function PaperflowCard({ children }: { children: JSX.Element | string }) {
    return (
        <Card className="h-48">
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
}