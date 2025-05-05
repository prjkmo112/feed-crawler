export function common(err: any) {
    return new Error(err instanceof Error ? err.message : String(err));
}