export const baseUrlFactory = (
  protocol: string,
  subDomain: string | undefined,
  baseDomain: string,
  port?: number,
) => {
  return `${protocol}://${[subDomain, baseDomain]
    .filter((s) => !!s)
    .join('.')}${port ? `:${port}` : ''}`;
};
