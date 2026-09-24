import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Post from './models/Post.js';
import Comment from './models/Comment.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/writespace';

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB at:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB successfully');

    // Clear existing collections
    await User.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();
    console.log('Cleared existing database records');

    // Create password hashes
    const adminPassword = await bcrypt.hash('admin123', 10);
    const studentPassword = await bcrypt.hash('student123', 10);
    const priyaPassword = await bcrypt.hash('priya123', 10);

    // Create Users
    const adminUser = await User.create({
      name: 'Admin Editor',
      email: 'admin@writespace.com',
      password: adminPassword,
      role: 'admin',
    });

    const alexUser = await User.create({
      name: 'Alex Chen',
      email: 'alex@student.edu',
      password: studentPassword,
      role: 'user',
    });

    const priyaUser = await User.create({
      name: 'Priya Sharma',
      email: 'priya@student.edu',
      password: priyaPassword,
      role: 'user',
    });

    console.log('Created sample users (Admin, Alex, Priya)');

    // Create Posts
    const post1 = await Post.create({
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
1. Encapsulation: Keeping fields private and providing getters/setters protects your internal state.
2. Inheritance: Creating child classes with the extends keyword avoids repeating common logic.
3. Polymorphism: Overriding methods lets you treat derived types under a unified parent interface.
4. Abstraction: Using interfaces and abstract classes lets you define contracts without dictating implementation details.

If you are just beginning with Java, write code by hand every single day. Don't rely solely on IDE autocompletion until you truly understand the syntax.`,
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80',
      category: 'Programming',
      author: alexUser._id,
    });

    const post2 = await Post.create({
      title: 'What I Learned from Building My First React Project',
      description: 'Reflecting on component lifecycles, state management hurdles, and why thinking in components transformed how I approach web development.',
      content: `During my second year of college, my web development journey had been strictly vanilla HTML, CSS, and DOM manipulation scripts. Whenever an event fired, I wrote manual querySelectors and innerHTML updates.

Then I built my first React project—a student task tracker—and my perspective shifted completely.

### The Big Shift: Thinking in State
In vanilla JavaScript, you are constantly mutating the DOM step-by-step. In React, you describe what the UI should look like based on current state, and React figures out the DOM updates efficiently.

Instead of manual DOM manipulation, you declare state and render UI deterministically.

### Mistakes I Made
1. Prop drilling too deep before learning about context or lifting state properly.
2. Infinite loops with useEffect by omitting or misconfiguring dependency arrays.
3. Overcomplicating component structure before it was necessary.

My biggest takeaway is to keep components simple and single-purpose. Start small, verify data flow, and avoid premature optimization.`,
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1000&q=80',
      category: 'Technology',
      author: priyaUser._id,
    });

    const post3 = await Post.create({
      title: 'Simple Ways to Improve Your Daily Coding Practice',
      description: 'Consistent daily habits, reading open-source codebases, and writing clean comments can dramatically boost your programming retention.',
      content: `A lot of college students ask how to move from copying tutorial snippets to actually solving problems independently. The secret isn't genius; it is deliberate daily practice.

### 1. Code in Small, Daily Increments
Thirty minutes of focused coding every single evening beats a frantic 8-hour binge the night before an assignment deadline. Your brain needs rest cycles to consolidate memory and spot conceptual patterns.

### 2. Read Other People's Code
Don't just write your own code. Go to GitHub, search for libraries or small projects built with the tech stack you are learning, and read their pull requests. See how seasoned engineers name variables, structure folders, and handle edge cases.

### 3. Explain the Code Out Loud (Rubber Ducking)
Whenever you encounter a tricky bug, explain the code line-by-line to a rubber duck, an inanimate object, or a classmate. Often, hearing yourself explain your logic highlights the exact assumption that was false.

These habits build professional discipline that will show immediately in your technical interviews.`,
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80',
      category: 'Education',
      author: alexUser._id,
    });

    const post4 = await Post.create({
      title: 'Understanding REST APIs: Endpoints, Methods, and Status Codes',
      description: 'A practical breakdown of how client-server communication works under the hood with JSON payloads and HTTP verbs.',
      content: `Almost every web and mobile app today relies on REST (Representational State Transfer) APIs to exchange data between a frontend client and a database server.

Here is a quick mental model that helped me pass my backend engineering exam and build reliable full-stack apps.

### HTTP Methods (The Verbs)
- GET: Retrieve data. Safe and idempotent.
- POST: Create a brand new resource. Submits a payload in the request body.
- PUT / PATCH: Update an existing resource.
- DELETE: Remove a resource by ID.

### Crucial Status Codes to Know
- 200 OK: Request succeeded and returned data.
- 201 Created: Resource was successfully created.
- 400 Bad Request: Client sent invalid or missing fields.
- 401 Unauthorized: User is not authenticated.
- 403 Forbidden: User is authenticated but lacks permission.
- 404 Not Found: Resource does not exist.
- 500 Internal Server Error: Unhandled server exception.

Always design clean URLs using plural nouns, like /api/posts and /api/posts/:id/comments.`,
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
      category: 'Programming',
      author: adminUser._id,
    });

    console.log('Created 4 realistic sample blog posts');

    // Create Comments
    await Comment.create({
      post: post1._id,
      user: priyaUser._id,
      content: 'Great explanation of OOP principles! The distinction between abstraction and encapsulation finally clicked for me.',
    });

    await Comment.create({
      post: post1._id,
      user: adminUser._id,
      content: 'Well written article Alex. Good emphasis on practicing daily syntax before jumping to advanced frameworks.',
    });

    await Comment.create({
      post: post2._id,
      user: alexUser._id,
      content: 'I had the exact same issue with useEffect infinite loops when I started! Thanks for sharing this.',
    });

    await Comment.create({
      post: post4._id,
      user: alexUser._id,
      content: 'The status code breakdown is super handy for college project vivas. Bookmarking this!',
    });

    console.log('Created sample comments');
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
