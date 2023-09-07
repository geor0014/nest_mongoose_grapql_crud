import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BlogPostType } from './blogpost.type';
import { BlogpostService } from './blogpost.service';
import { CreateBlogPostDto } from './dto/create-blogpost-dto';
import { UpdateBlogPostDto } from './dto/update-blogpost-dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogPostCommand } from './commands/implementation/create-blogpost.command';
import { UpdateBlogPostCommand } from './commands/implementation/update-blogpost.command';
import { DeleteBlogPostCommand } from './commands/implementation/detele-blogpost.command';

@Resolver((of) => BlogPostType)
export class BlogPostResolver {
  constructor(
    private blogpostService: BlogpostService,
    private readonly commandBus: CommandBus,
  ) {}

  @Query((returns) => [BlogPostType])
  getblogposts() {
    return this.blogpostService.getAllBlogPosts();
  }

  @Query((returns) => BlogPostType)
  blogpostById(@Args('id') id: string) {
    return this.blogpostService.getBlogPost(id);
  }

  @Mutation((returns) => BlogPostType)
  createBlogPost(
    @Args('createBlogPostDto') createBlogPostDto: CreateBlogPostDto,
  ) {
    return this.commandBus.execute(
      new CreateBlogPostCommand(createBlogPostDto),
    );
  }

  @Mutation((returns) => BlogPostType)
  updateBlogPost(
    @Args('id') id: string,
    @Args('UpdateBlogPostDto') UpdateBlogPostDto: UpdateBlogPostDto,
  ) {
    return this.commandBus.execute(
      new UpdateBlogPostCommand(id, UpdateBlogPostDto),
    );
  }

  @Mutation((returns) => BlogPostType)
  deleteBlogPost(@Args('id') id: string) {
    this.commandBus.execute(new DeleteBlogPostCommand(id));
  }
}
