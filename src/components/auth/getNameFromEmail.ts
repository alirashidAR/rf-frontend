export const getNameFromEmail = (email: string): string => {
    const localPart = email.split("@")[0];
    const parts = localPart.split(/[._]/);
    return parts
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };
  