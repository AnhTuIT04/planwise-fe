import React from "react";

const InvitetationsHeader = () => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-foreground text-2xl font-semibold">Invitations</h1>
        <p className="text-muted-foreground text-sm">
          Manage your project invitations and notifications here.
        </p>
      </div>
    </div>
  );
};

export default InvitetationsHeader;