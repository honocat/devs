import java.io.IOException;
import java.io.InputStream;

public class Main {
    public static void main(String[] args) throws IOException {
        FastScanner sc = new FastScanner(System.in);
        String n = sc.next();

        for (int i = 0; i < n.length(); i++) {
            if (i != 0 && i % 3 == 0) {
                System.out.print(',');
            }
            System.out.print(n.charAt(i));
        }

        System.out.println();
        sc.close();
    }
}

class FastScanner{
    private final InputStream in;
    private final byte[] buffer = new byte[1 << 16];
    private int pos = 0, len = 0;

    public FastScanner(InputStream in){
        this.in = in;
    }

    private int read() throws IOException{
        if(this.pos >= this.len){
            this.len = this.in.read(buffer);
            this.pos = 0;
            if(this.len <= 0) return -1;
        }
        return buffer[this.pos++];
    }

    public void close() throws IOException {
        in.close();
    }

    long nextLong() throws IOException{
        int c;
        while((c = read()) <= ' '){ // 空白をスキップ
            if(c == -1) return Long.MIN_VALUE;
        }
        boolean minus = false;
        if(c == '-'){
            minus = true;
            c = read();
        }
        long val = c - '0';
        while((c = read()) > ' '){
            val = val * 10 + (c - '0');
        }
        return minus ? -val : val;
    }

    int nextInt() throws IOException{
        return (int)nextLong();
    }

    String next() throws IOException{
        int c;
        while((c = read()) <= ' '){
            if(c == -1) return null;
        }

        StringBuilder sb = new StringBuilder();
        sb.append((char)c);
        while((c = read()) > ' '){
            sb.append((char)c);
        }

        return sb.toString();
    }

    double nextDouble() throws IOException{
        return Double.parseDouble(next());
    }

    float nextFloat() throws IOException{
        return Float.parseFloat(next());
    }
}