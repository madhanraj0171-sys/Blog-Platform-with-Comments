import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string; // bcrypt hash
  role: 'user' | 'admin';
  createdAt: string;
}

export interface IPost {
  _id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  category: string;
  author: string | { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface IComment {
  _id: string;
  post: string;
  user: string | { _id: string; name: string; email: string };
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface DatabaseSchema {
  users: IUser[];
  posts: IPost[];
  comments: IComment[];
}

const DB_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.join(DB_DIR, 'db.json');

function ensureDbFile(): DatabaseSchema {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData = getInitialSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed.users || !parsed.posts || !parsed.comments) {
      throw new Error('Invalid db format');
    }
    return parsed;
  } catch {
    const initialData = getInitialSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
    return initialData;
  }
}

function saveDb(data: DatabaseSchema) {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export function getInitialSeedData(): DatabaseSchema {
  const adminSalt = bcrypt.genSaltSync(10);
  const adminHashed = bcrypt.hashSync('admin123', adminSalt);

  const studentSalt = bcrypt.genSaltSync(10);
  const studentHashed = bcrypt.hashSync('student123', studentSalt);

  const priyaSalt = bcrypt.genSaltSync(10);
  const priyaHashed = bcrypt.hashSync('priya123', priyaSalt);

  const users: IUser[] = [
    {
      _id: 'user_admin_01',
      name: 'Admin Editor',
      email: 'admin@writespace.com',
      password: adminHashed,
      role: 'admin',
      createdAt: '2026-08-15T10:00:00.000Z',
    },
    {
      _id: 'user_alex_02',
      name: 'Alex Chen',
      email: 'alex@student.edu',
      password: studentHashed,
      role: 'user',
      createdAt: '2026-08-20T14:30:00.000Z',
    },
    {
      _id: 'user_priya_03',
      name: 'Priya Sharma',
      email: 'priya@student.edu',
      password: priyaHashed,
      role: 'user',
      createdAt: '2026-08-25T09:15:00.000Z',
    },
  ];

  const posts: IPost[] = [
    {
      _id: 'post_01',
      title: 'Getting Started with Java: From Syntax to OOP',
      description: 'A beginner-friendly guide to understanding variables, classes, inheritance, and core JVM concepts for your college computer science course.',
      content: `When I first stepped into my Object-Oriented Programming class, Java felt rigid and full of boilerplate. Coming from Python, seeing 'public static void main(String[] args)' felt unnecessarily wordy.

However, once you understand why Java is designed this way, the structure starts to become your ally, especially on larger team projects.

### 1. The JVM and Portability
The phrase "Write Once, Run Anywhere" isn't just marketing. The Java Virtual Machine translates compiled bytecode (.class) into native instructions for whichever operating system your machine runs. This abstraction prevents countless platform-specific compilation headaches.

### 2. Classes and Objects
In Java, virtually everything revolves around objects. An object is an instance of a class that holds state (fields) and behavior (methods).

\`\`\`java
public class Student {
    private String name;
    private int semester;

    public Student(String name, int semester) {
        this.name = name;
        this.semester = semester;
    }

    public void displayInfo() {
        System.out.println(name + " is in semester " + semester);
    }
}
\`\`\`

### 3. The 4 Pillars of OOP
1. **Encapsulation**: Keeping fields private and providing getters/setters protects your internal state.
2. **Inheritance**: Creating child classes with the \`extends\` keyword avoids repeating common logic.
3. **Polymorphism**: Overriding methods lets you treat derived types under a unified parent interface.
4. **Abstraction**: Using interfaces and abstract classes lets you define contracts without dictating implementation details.

If you are just beginning with Java, write code by hand every single day. Don't rely solely on IDE autocompletion until you truly understand the syntax.`,
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80',
      category: 'Programming',
      author: 'user_alex_02',
      createdAt: '2026-09-02T11:20:00.000Z',
      updatedAt: '2026-09-02T11:20:00.000Z',
    },
    {
      _id: 'post_02',
      title: 'What I Learned from Building My First React Project',
      description: 'Reflecting on component lifecycles, state management hurdles, and why thinking in components transformed how I approach web development.',
      content: `During my second year of college, my web development journey had been strictly vanilla HTML, CSS, and DOM manipulation scripts. Whenever an event fired, I wrote manual querySelectors and innerHTML updates.

Then I built my first React project—a student task tracker—and my perspective shifted completely.

### The Big Shift: Thinking in State
In vanilla JavaScript, you are constantly mutating the DOM step-by-step. In React, you describe what the UI should look like based on current state, and React figures out the DOM updates efficiently.

Instead of:
\`\`\`js
// Vanilla DOM manipulation
button.addEventListener('click', () => {
  counter++;
  display.innerText = counter;
});
\`\`\`

You declare state:
\`\`\`jsx
const [counter, setCounter] = useState(0);
return <button onClick={() => setCounter(c => c + 1)}>{counter}</button>;
\`\`\`

### Mistakes I Made
1. **Prop drilling too deep**: Passing props through 5 levels before learning about context or lifting state properly.
2. **Infinite loops with useEffect**: Not understanding dependency arrays caused my API to get pinged hundreds of times in minutes.
3. **Overcomplicating component structure**: Breaking single buttons into 4 different subcomponents before it was necessary.

My biggest takeaway is to keep components simple and single-purpose. Start small, verify data flow, and avoid premature optimization.`,
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1000&q=80',
      category: 'Technology',
      author: 'user_priya_03',
      createdAt: '2026-09-08T15:45:00.000Z',
      updatedAt: '2026-09-08T15:45:00.000Z',
    },
    {
      _id: 'post_03',
      title: 'Simple Ways to Improve Your Daily Coding Practice',
      description: 'Consistent daily habits, reading open-source codebases, and writing clean comments can dramatically boost your programming retention.',
      content: `A lot of college students ask how to move from copying tutorial snippets to actually solving problems independently. The secret isn't genius; it is deliberate daily practice.

### 1. Code in Small, Daily Increments
Thirty minutes of focused coding every single evening beats a frantic 8-hour binge the night before an assignment deadline. Your brain needs rest cycles to consolidate memory and spot conceptual patterns.

### 2. Read Other People's Code
Don't just write your own code. Go to GitHub, search for libraries or small projects built with the tech stack you are learning, and read their pull requests. See how seasoned engineers name variables, structure folders, and handle edge cases.

### 3. Explain the Code Out Loud (Rubber Ducking)
Whenever you encounter a tricky bug, explain the code line-by-line to a rubber duck, an inanimate object, or a classmate. Often, hearing yourself explain your logic highlights the exact assumption that was false.

### 4. Write Meaningful Commit Messages
Stop writing "update", "fix bug", or "changes". Write concise commit messages like:
- "feat: add category filter to blog list"
- "fix: prevent empty comment submission"

These habits build professional discipline that will show immediately in your technical interviews.`,
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80',
      category: 'Education',
      author: 'user_alex_02',
      createdAt: '2026-09-12T09:10:00.000Z',
      updatedAt: '2026-09-12T09:10:00.000Z',
    },
    {
      _id: 'post_04',
      title: 'Understanding REST APIs: Endpoints, Methods, and Status Codes',
      description: 'A practical breakdown of how client-server communication works under the hood with JSON payloads and HTTP verbs.',
      content: `Almost every web and mobile app today relies on REST (Representational State Transfer) APIs to exchange data between a frontend client and a database server.

Here is a quick mental model that helped me pass my backend engineering exam and build reliable full-stack apps.

### HTTP Methods (The Verbs)
- **GET**: Retrieve data. Safe and idempotent (calling it multiple times doesn't alter server state).
- **POST**: Create a brand new resource. Submits a payload in the request body.
- **PUT / PATCH**: Update an existing resource. PUT replaces the resource; PATCH modifies specific fields.
- **DELETE**: Remove a resource by ID.

### Crucial Status Codes to Know
- **200 OK**: Request succeeded and returned data.
- **201 Created**: Resource was successfully created (standard for POST).
- **400 Bad Request**: Client sent invalid or missing fields.
- **401 Unauthorized**: User is not authenticated (missing or expired JWT).
- **403 Forbidden**: User is authenticated but lacks permission (e.g. regular user trying to delete someone else's post).
- **404 Not Found**: Resource does not exist.
- **500 Internal Server Error**: Unhandled exception in backend logic.

Always design clean URLs using plural nouns, like \`/api/posts\` and \`/api/posts/:id/comments\`.`,
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
      category: 'Programming',
      author: 'user_admin_01',
      createdAt: '2026-09-16T16:00:00.000Z',
      updatedAt: '2026-09-16T16:00:00.000Z',
    },
    {
      _id: 'post_05',
      title: 'Exploring the Ridge Trails: A Weekend Reset from Screens',
      description: 'Taking a 48-hour digital detox to hike the ridge trails, reconnect with nature, and clear my head before midterms week.',
      content: `As computer science students, we spend 10 to 14 hours every single day staring at glowing monitors, debugging syntax errors, and scrolling feeds.

Last weekend, two classmates and I packed lightweight daypacks, left our laptops in the dorm, and drove out to the nearby mountain ridge trail.

### The Value of Intentional Unplugging
Walking uphill through cedar trees without notifications buzzing in your pocket does wonders for your mental stamina. We talked about life outside of software, watched the sunset over the valley, and made camp dinner over a portable stove.

When I sat back down at my desk on Monday morning, problems that felt overwhelming the previous Friday suddenly looked straightforward. If you are feeling burnt out, give yourself permission to step away from your keyboard.`,
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
      category: 'Travel',
      author: 'user_priya_03',
      createdAt: '2026-09-19T13:10:00.000Z',
      updatedAt: '2026-09-19T13:10:00.000Z',
    },
    {
      _id: 'post_06',
      title: 'Balancing College Coursework and Side Projects Without Burning Out',
      description: 'Practical time-blocking techniques and realistic goal-setting strategies that helped me ship side projects while keeping my GPA solid.',
      content: `Every internship job posting lists requirements like "Demonstrated side projects" alongside strong academic records. Trying to do both can easily lead to fatigue.

Here is the simple framework that saved my semester:

1. **Protect your core study blocks**: Never sacrifice sleep or basic coursework for late-night coding sprints.
2. **Work on one project at a time**: Having 6 half-finished repositories is worse than having 1 complete, polished app with a clear README.
3. **Use the 5-hour rule**: Dedicate a scheduled 5 hours per week (e.g. Saturday mornings) exclusively to your portfolio build.
4. **Scope down ruthlessly**: Define your MVP (Minimum Viable Product) and ship it before thinking about edge-case micro-features.

Consistency over intensity is what actually turns ideas into finished products.`,
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80',
      category: 'Lifestyle',
      author: 'user_alex_02',
      createdAt: '2026-09-22T08:30:00.000Z',
      updatedAt: '2026-09-22T08:30:00.000Z',
    },
  ];

  const comments: IComment[] = [
    {
      _id: 'comment_01',
      post: 'post_01',
      user: 'user_priya_03',
      content: 'Great explanation of OOP principles! The distinction between abstraction and encapsulation finally clicked for me.',
      createdAt: '2026-09-03T14:10:00.000Z',
      updatedAt: '2026-09-03T14:10:00.000Z',
    },
    {
      _id: 'comment_02',
      post: 'post_01',
      user: 'user_admin_01',
      content: 'Well written article Alex. Good emphasis on practicing daily syntax before jumping to advanced frameworks.',
      createdAt: '2026-09-04T09:20:00.000Z',
      updatedAt: '2026-09-04T09:20:00.000Z',
    },
    {
      _id: 'comment_03',
      post: 'post_02',
      user: 'user_alex_02',
      content: 'I had the exact same issue with useEffect infinite loops when I started! Thanks for sharing this.',
      createdAt: '2026-09-09T18:05:00.000Z',
      updatedAt: '2026-09-09T18:05:00.000Z',
    },
    {
      _id: 'comment_04',
      post: 'post_04',
      user: 'user_alex_02',
      content: 'The status code breakdown is super handy for college project vivas. Bookmarking this!',
      createdAt: '2026-09-17T11:40:00.000Z',
      updatedAt: '2026-09-17T11:40:00.000Z',
    },
  ];

  return { users, posts, comments };
}

// Database helper functions replicating Mongoose-like operations
export const db = {
  // Users
  findUserByEmail(email: string): IUser | undefined {
    const data = ensureDbFile();
    return data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  findUserById(id: string): IUser | undefined {
    const data = ensureDbFile();
    return data.users.find(u => u._id === id);
  },
  getAllUsers(): Omit<IUser, 'password'>[] {
    const data = ensureDbFile();
    return data.users.map(({ password, ...rest }) => rest);
  },
  createUser(userData: Omit<IUser, '_id' | 'createdAt'>): IUser {
    const data = ensureDbFile();
    const newUser: IUser = {
      ...userData,
      _id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
    };
    data.users.push(newUser);
    saveDb(data);
    return newUser;
  },

  // Posts
  getPosts(filters?: { search?: string; category?: string; sort?: 'newest' | 'oldest'; authorId?: string }) {
    const data = ensureDbFile();
    let result = [...data.posts];

    if (filters?.authorId) {
      result = result.filter(p => {
        const aId = typeof p.author === 'object' ? p.author._id : p.author;
        return aId === filters.authorId;
      });
    }

    if (filters?.category && filters.category !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === filters.category!.toLowerCase());
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
      );
    }

    if (filters?.sort === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      // default newest
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Populate author
    return result.map(post => {
      const authorId = typeof post.author === 'object' ? post.author._id : post.author;
      const user = data.users.find(u => u._id === authorId);
      return {
        ...post,
        author: user ? { _id: user._id, name: user.name, email: user.email } : { _id: authorId, name: 'Anonymous', email: '' }
      };
    });
  },

  getPostById(id: string) {
    const data = ensureDbFile();
    const post = data.posts.find(p => p._id === id);
    if (!post) return null;

    const authorId = typeof post.author === 'object' ? post.author._id : post.author;
    const user = data.users.find(u => u._id === authorId);
    return {
      ...post,
      author: user ? { _id: user._id, name: user.name, email: user.email } : { _id: authorId, name: 'Anonymous', email: '' }
    };
  },

  createPost(postData: { title: string; description: string; content: string; image: string; category: string; author: string }) {
    const data = ensureDbFile();
    const newPost: IPost = {
      ...postData,
      _id: 'post_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.posts.unshift(newPost);
    saveDb(data);

    const user = data.users.find(u => u._id === postData.author);
    return {
      ...newPost,
      author: user ? { _id: user._id, name: user.name, email: user.email } : { _id: postData.author, name: 'Anonymous', email: '' }
    };
  },

  updatePost(id: string, updates: Partial<Pick<IPost, 'title' | 'description' | 'content' | 'image' | 'category'>>) {
    const data = ensureDbFile();
    const index = data.posts.findIndex(p => p._id === id);
    if (index === -1) return null;

    data.posts[index] = {
      ...data.posts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveDb(data);

    const updated = data.posts[index];
    const authorId = typeof updated.author === 'object' ? updated.author._id : updated.author;
    const user = data.users.find(u => u._id === authorId);
    return {
      ...updated,
      author: user ? { _id: user._id, name: user.name, email: user.email } : { _id: authorId, name: 'Anonymous', email: '' }
    };
  },

  deletePost(id: string) {
    const data = ensureDbFile();
    const postIndex = data.posts.findIndex(p => p._id === id);
    if (postIndex === -1) return false;

    data.posts.splice(postIndex, 1);
    // Also remove associated comments
    data.comments = data.comments.filter(c => c.post !== id);
    saveDb(data);
    return true;
  },

  // Comments
  getCommentsByPostId(postId: string) {
    const data = ensureDbFile();
    const postComments = data.comments.filter(c => c.post === postId);
    postComments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return postComments.map(comment => {
      const userId = typeof comment.user === 'object' ? comment.user._id : comment.user;
      const user = data.users.find(u => u._id === userId);
      return {
        ...comment,
        user: user ? { _id: user._id, name: user.name, email: user.email } : { _id: userId, name: 'Anonymous', email: '' }
      };
    });
  },

  getAllComments() {
    const data = ensureDbFile();
    return data.comments.map(comment => {
      const userId = typeof comment.user === 'object' ? comment.user._id : comment.user;
      const user = data.users.find(u => u._id === userId);
      const post = data.posts.find(p => p._id === comment.post);
      return {
        ...comment,
        postTitle: post ? post.title : 'Deleted Post',
        user: user ? { _id: user._id, name: user.name, email: user.email } : { _id: userId, name: 'Anonymous', email: '' }
      };
    });
  },

  createComment(postId: string, userId: string, content: string) {
    const data = ensureDbFile();
    const newComment: IComment = {
      _id: 'comment_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      post: postId,
      user: userId,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.comments.push(newComment);
    saveDb(data);

    const user = data.users.find(u => u._id === userId);
    return {
      ...newComment,
      user: user ? { _id: user._id, name: user.name, email: user.email } : { _id: userId, name: 'Anonymous', email: '' }
    };
  },

  updateComment(commentId: string, content: string) {
    const data = ensureDbFile();
    const index = data.comments.findIndex(c => c._id === commentId);
    if (index === -1) return null;

    data.comments[index].content = content;
    data.comments[index].updatedAt = new Date().toISOString();
    saveDb(data);

    const updated = data.comments[index];
    const userId = typeof updated.user === 'object' ? updated.user._id : updated.user;
    const user = data.users.find(u => u._id === userId);
    return {
      ...updated,
      user: user ? { _id: user._id, name: user.name, email: user.email } : { _id: userId, name: 'Anonymous', email: '' }
    };
  },

  deleteComment(commentId: string) {
    const data = ensureDbFile();
    const index = data.comments.findIndex(c => c._id === commentId);
    if (index === -1) return false;

    data.comments.splice(index, 1);
    saveDb(data);
    return true;
  },

  getCommentById(commentId: string) {
    const data = ensureDbFile();
    return data.comments.find(c => c._id === commentId) || null;
  }
};
