import PageWrapper from "./PageWrapper.tsx";
import PageHeader from "./PageHeader.tsx";

interface LoadingProps {
    title: string;
}

export default function Loading({title}: LoadingProps) {
    return <PageWrapper>
        <PageHeader notFoundHeader={title} returnTo={"/search"} />
        <div className="max-w-3xl mx-auto px-4 py-4">Loading...</div>
    </PageWrapper>
}
