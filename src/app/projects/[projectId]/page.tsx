interface pageProps {
    params: Promise<{ projectId: string }>;
}

const page = async ({params}: pageProps) => {
    const{projectId} = await params;
    return(
        <div>
            Project Id: {projectId}
        </div>
    );
}

export default page;