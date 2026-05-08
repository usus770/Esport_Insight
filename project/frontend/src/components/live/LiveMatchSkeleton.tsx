export default function LiveMatchSkeleton() {
    return (
        <div className="match-card match-card--skeleton">
            <div className="skeleton-line skeleton-line--short" />
            <div className="skeleton-line skeleton-line--medium" />
            <div className="skeleton-teams">
                <div className="skeleton-team" />
                <div className="skeleton-vs" />
                <div className="skeleton-team" />
            </div>
            <div className="skeleton-line skeleton-line--short" />
        </div>
    );
}
