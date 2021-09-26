{
  description = "Swarm";

  inputs = {
    nixpkgs.url = github:NixOS/nixpkgs;
  };
  outputs = { self, nixpkgs }: {

    devShell.x86_64-linux =
        nixpkgs.legacyPackages.x86_64-linux.mkShell { 
          buildInputs = [
            nixpkgs.legacyPackages.x86_64-linux.simple-http-server 
            nixpkgs.legacyPackages.x86_64-linux.nodejs
          ]; 
        };
  };
}
