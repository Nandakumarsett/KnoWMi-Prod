// Optimized SkipList for real-time ranking lookups
class SkipListNode {
  score: number;
  profileId: string;
  next: (SkipListNode | null)[];

  constructor(score: number, profileId: string, level: number) {
    this.score = score;
    this.profileId = profileId;
    this.next = new Array(level).fill(null);
  }
}

export class SkipList {
  private head: SkipListNode;
  private maxLevel: number = 16;
  private currentLevel: number = 1;

  constructor() {
    this.head = new SkipListNode(-Infinity, '', this.maxLevel);
  }

  insert(score: number, profileId: string) {
    const update = new Array(this.maxLevel).fill(this.head);
    let curr = this.head;

    for (let i = this.currentLevel - 1; i >= 0; i--) {
      while (curr.next[i] && (curr.next[i]!.score > score || (curr.next[i]!.score === score && curr.next[i]!.profileId < profileId))) {
        curr = curr.next[i]!;
      }
      update[i] = curr;
    }

    const level = this.randomLevel();
    if (level > this.currentLevel) {
      for (let i = this.currentLevel; i < level; i++) {
        update[i] = this.head;
      }
      this.currentLevel = level;
    }

    const newNode = new SkipListNode(score, profileId, level);
    for (let i = 0; i < level; i++) {
      newNode.next[i] = update[i].next[i];
      update[i].next[i] = newNode;
    }
  }

  getRank(profileId: string): number {
    let curr = this.head;
    let rank = 0;
    // Note: A full rank implementation requires tracking 'width' of skips.
    // For this frontend demo, we iterate the base level.
    curr = this.head.next[0]!;
    rank = 1;
    while (curr) {
      if (curr.profileId === profileId) return rank;
      curr = curr.next[0]!;
      rank++;
    }
    return -1;
  }

  private randomLevel(): number {
    let level = 1;
    while (Math.random() < 0.5 && level < this.maxLevel) {
      level++;
    }
    return level;
  }
}
