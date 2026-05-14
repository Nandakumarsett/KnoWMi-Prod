export class TrieNode {
  children: { [key: string]: TrieNode } = {};
  isEndOfWord: boolean = false;
  profileId: string | null = null;
  displayName: string | null = null;
}

export class Trie {
  root: TrieNode = new TrieNode();

  insert(name: string, profileId: string) {
    let node = this.root;
    const lowerName = name.toLowerCase();
    for (const char of lowerName) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
    node.profileId = profileId;
    node.displayName = name;
  }

  search(prefix: string): any[] {
    let node = this.root;
    const lowerPrefix = prefix.toLowerCase();
    for (const char of lowerPrefix) {
      if (!node.children[char]) return [];
      node = node.children[char];
    }
    return this.collectAll(node);
  }

  private collectAll(node: TrieNode, results: any[] = []): any[] {
    if (node.isEndOfWord) {
      results.push({ id: node.profileId, name: node.displayName });
    }
    for (const child in node.children) {
      this.collectAll(node.children[child], results);
    }
    return results;
  }
}
