import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </header>
  );
};

export default PageHeader;
